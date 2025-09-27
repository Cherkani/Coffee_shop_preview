-- =========================================================
-- CoffeeShop SaaS: Row Level Security (RLS) Policies
-- =========================================================

-- Enable RLS on all tables
alter table orgs enable row level security;
alter table subscriptions enable row level security;
alter table locations enable row level security;
alter table org_members enable row level security;
alter table location_members enable row level security;
alter table kds_tokens enable row level security;

alter table products enable row level security;
alter table sizes enable row level security;
alter table product_prices enable row level security;
alter table modifier_groups enable row level security;
alter table modifiers enable row level security;
alter table product_modifier_groups enable row level security;

alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table recipe_items enable row level security;

alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_item_modifiers enable row level security;

alter table payments enable row level security;
alter table inventory_tx enable row level security;
alter table alerts enable row level security;

-- =========================================================
-- RLS Policies
-- =========================================================

-- orgs
create policy orgs_read on orgs
  for select using (is_superuser() or user_is_org_owner(id));

create policy orgs_update on orgs
  for update using (is_superuser() or user_is_org_owner(id))
  with check (is_superuser() or user_is_org_owner(id));

-- subscriptions
create policy subs_read on subscriptions
  for select using (is_superuser() or user_is_org_owner(org_id));

create policy subs_write on subscriptions
  for all using (is_superuser() or user_is_org_owner(org_id))
  with check (is_superuser() or user_is_org_owner(org_id));

-- locations
create policy locations_read on locations
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(id));

create policy locations_insert on locations
  for insert with check (is_superuser() or user_is_org_owner(org_id));

create policy locations_update on locations
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(id));

-- org_members
create policy org_members_read on org_members
  for select using (is_superuser() or user_is_org_owner(org_id));

create policy org_members_write on org_members
  for all using (is_superuser() or user_is_org_owner(org_id))
  with check (is_superuser() or user_is_org_owner(org_id));

-- location_members
create policy location_members_read on location_members
  for select using (
    is_superuser() or
    exists (select 1 from locations l where l.id = location_members.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_members.location_id)
  );

create policy location_members_write on location_members
  for all using (
    is_superuser() or
    exists (select 1 from locations l where l.id = location_members.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_members.location_id)
  )
  with check (
    is_superuser() or
    exists (select 1 from locations l where l.id = location_members.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_members.location_id)
  );

-- KDS tokens (location admins & owners can read/manage)
create policy kds_tokens_read on kds_tokens
  for select using (
    is_superuser() or
    exists (select 1 from locations l where l.id = kds_tokens.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_id)
  );

create policy kds_tokens_write on kds_tokens
  for all using (
    is_superuser() or
    exists (select 1 from locations l where l.id = kds_tokens.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_id)
  )
  with check (
    is_superuser() or
    exists (select 1 from locations l where l.id = kds_tokens.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_id)
  );

-- Catalog (products, sizes, prices, modifier groups, modifiers, mapping)
create policy products_select on products
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy products_insert on products
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy products_update on products
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy sizes_select on sizes
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy sizes_insert on sizes
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy sizes_update on sizes
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy product_prices_select on product_prices
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy product_prices_insert on product_prices
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy product_prices_update on product_prices
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy modifier_groups_select on modifier_groups
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy modifier_groups_insert on modifier_groups
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy modifier_groups_update on modifier_groups
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy modifiers_select on modifiers
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy modifiers_insert on modifiers
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy modifiers_update on modifiers
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy pmg_select on product_modifier_groups
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy pmg_write on product_modifier_groups
  for all using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

-- Inventory & Recipes
create policy ingredients_select on ingredients
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy ingredients_insert on ingredients
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy ingredients_update on ingredients
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy recipes_select on recipes
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy recipes_insert on recipes
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy recipes_update on recipes
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy recipe_items_select on recipe_items
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy recipe_items_write on recipe_items
  for all using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

-- Orders & Items & Modifiers
create policy orders_select on orders
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy orders_insert on orders
  for insert with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));
create policy orders_update on orders
  for update using (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id))
  with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

create policy order_items_select on order_items
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy order_items_write on order_items
  for all using (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id))
  with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

create policy oim_select on order_item_modifiers
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy oim_write on order_item_modifiers
  for all using (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id))
  with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

-- Payments
create policy payments_select on payments
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy payments_insert on payments
  for insert with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

-- Inventory TX & Alerts
create policy invtx_select on inventory_tx
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy invtx_insert on inventory_tx
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy alerts_select on alerts
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy alerts_write on alerts
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
