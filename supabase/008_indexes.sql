-- =========================================================
-- CoffeeShop SaaS: Performance Indexes
-- =========================================================

create index if not exists idx_orders_loc_created on orders (location_id, created_at);
create index if not exists idx_payments_loc_paidat on payments (location_id, paid_at);
create index if not exists idx_invtx_loc_created on inventory_tx (location_id, created_at);
create index if not exists idx_order_items_order on order_items (order_id);
create index if not exists idx_recipe_items_ing on recipe_items (ingredient_id);
create index if not exists idx_products_active on products (location_id, is_active);
