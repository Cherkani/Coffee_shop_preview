-- =========================================================
-- CoffeeShop SaaS: Business Logic - Payment Processing & Triggers
-- =========================================================

-- Business Logic: Cash Pay RPC (atomic)
create or replace function pay_cash(p_order_id uuid, p_amount_cents int)
returns void
language plpgsql
security definer
as $$
declare v_org uuid; v_loc uuid;
begin
  -- Scope check
  select org_id, location_id into v_org, v_loc from orders where id = p_order_id;
  if v_org is null then
    raise exception 'order not found';
  end if;
  if not (is_superuser() or user_is_location_admin(v_loc) or user_is_location_cashier(v_loc)) then
    raise exception 'not authorized to pay this order';
  end if;

  insert into payments (org_id, location_id, order_id, method, amount_cents)
  values (v_org, v_loc, p_order_id, 'cash', p_amount_cents);

  update orders set status='paid' where id = p_order_id;
end $$;

-- Triggers: Deduct inventory on order -> paid + low-stock alerts
create or replace function deduct_inventory_on_paid()
returns trigger language plpgsql as $$
begin
  if NEW.status = 'paid' and coalesce(OLD.status,'queued') <> 'paid' then
    -- Insert inventory transactions for all recipe ingredients
    insert into inventory_tx (org_id, location_id, ingredient_id, qty, reason, order_id)
    select
      o.org_id,
      o.location_id,
      ri.ingredient_id,
      - (ri.qty * oi.qty) as qty,  -- deduction is negative
      'deduct_on_sale',
      o.id
    from orders o
    join order_items oi on oi.order_id = o.id
    join recipes r on r.org_id = o.org_id and r.location_id = o.location_id
                  and r.product_id = oi.product_id
                  and (r.size_id = oi.size_id or r.size_id is null)
    join recipe_items ri on ri.recipe_id = r.id
    where o.id = NEW.id;

    -- Apply to on_hand
    update ingredients i
    set on_hand = i.on_hand + tx.sum_qty
    from (
      select ingredient_id, sum(qty) as sum_qty
      from inventory_tx
      where order_id = NEW.id
      group by ingredient_id
    ) tx
    where tx.ingredient_id = i.id;

    -- Create low-stock alerts
    insert into alerts (org_id, location_id, kind, payload)
    select i.org_id, i.location_id, 'low_stock',
           jsonb_build_object('ingredient_id', i.id, 'name', i.name, 'on_hand', i.on_hand)
    from ingredients i
    where i.org_id = NEW.org_id
      and i.location_id = NEW.location_id
      and i.on_hand <= i.low_stock_threshold
    on conflict do nothing;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_deduct_on_paid on orders;
create trigger trg_deduct_on_paid
after update on orders
for each row execute function deduct_inventory_on_paid();

-- Optional: enforce cashier discount cap (10%)
create or replace function enforce_cashier_discount()
returns trigger language plpgsql as $$
declare v_loc uuid; v_is_cashier boolean; v_sum int;
begin
  v_loc := coalesce(NEW.location_id, OLD.location_id);
  v_is_cashier := user_is_location_cashier(v_loc);
  if v_is_cashier then
    select coalesce(sum(line_total_cents),0)
      into v_sum
    from order_items where order_id = coalesce(NEW.id, OLD.id);
    if NEW.discount_cents > (v_sum * 0.10) then
      raise exception 'cashier discount exceeds 10%% cap';
    end if;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_enforce_cashier_discount on orders;
create trigger trg_enforce_cashier_discount
before insert or update on orders
for each row execute function enforce_cashier_discount();

-- (Optional) Guard: prevent cashiers from setting status to 'void'
create or replace function prevent_cashier_void()
returns trigger language plpgsql as $$
begin
  if user_is_location_cashier(coalesce(NEW.location_id, OLD.location_id))
     and NEW.status = 'void' then
    raise exception 'cashier cannot void orders';
  end if;
  return NEW;
end $$;

drop trigger if exists trg_prevent_cashier_void on orders;
create trigger trg_prevent_cashier_void
before insert or update on orders
for each row execute function prevent_cashier_void();
