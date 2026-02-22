-- ============================================================
-- 008: Tighten RLS — admin operations via Edge Functions
-- ============================================================
-- Admin write operations now go through the admin-api Edge Function
-- which uses the service role key (bypasses RLS).
-- This migration locks down all tables to proper access levels.
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ── Products ──────────────────────────────────────────────────
drop policy if exists "Allow product writes" on products;
drop policy if exists "Allow product updates" on products;
drop policy if exists "Allow product deletes" on products;
drop policy if exists "Products are publicly readable" on products;

create policy "Products are publicly readable" on products
  for select using (is_active = true);

-- ── Orders ────────────────────────────────────────────────────
drop policy if exists "Orders are readable" on orders;
drop policy if exists "Allow order inserts" on orders;
drop policy if exists "Allow order updates" on orders;
drop policy if exists "Users can view own orders" on orders;
drop policy if exists "Users can create own orders" on orders;

create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id);

-- ── Order Items ───────────────────────────────────────────────
drop policy if exists "Order items are readable" on order_items;
drop policy if exists "Allow order item inserts" on order_items;
drop policy if exists "Users can view own order items" on order_items;
drop policy if exists "Users can insert own order items" on order_items;

create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
create policy "Users can insert own order items" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ── Categories ────────────────────────────────────────────────
drop policy if exists "Allow category writes" on categories;
drop policy if exists "Allow category updates" on categories;
drop policy if exists "Allow category deletes" on categories;

-- ── Promo Codes ───────────────────────────────────────────────
drop policy if exists "Promo codes are readable" on promo_codes;
drop policy if exists "Allow promo code writes" on promo_codes;
drop policy if exists "Allow promo code updates" on promo_codes;
drop policy if exists "Allow promo code deletes" on promo_codes;
drop policy if exists "Promo codes are publicly readable" on promo_codes;

create policy "Promo codes are publicly readable" on promo_codes
  for select using (is_active = true);

-- ── Storage: product-images ───────────────────────────────────
drop policy if exists "Allow uploads to product-images" on storage.objects;
drop policy if exists "Allow updates to product-images" on storage.objects;
drop policy if exists "Allow deletes from product-images" on storage.objects;
-- No public write policies — admin uploads via Edge Function signed URLs
-- The service role key (used by the Edge Function) bypasses storage RLS
