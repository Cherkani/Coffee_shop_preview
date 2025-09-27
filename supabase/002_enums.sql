-- =========================================================
-- CoffeeShop SaaS: Custom Types (Enums)
-- =========================================================

do $$ begin
  create type order_status as enum ('queued','in_progress','ready','paid','void');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inv_tx_type as enum ('deduct_on_sale','manual_adjust');
exception when duplicate_object then null; end $$;
