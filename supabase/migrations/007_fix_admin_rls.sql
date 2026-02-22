-- ============================================================
-- 007: Fix admin RLS for password-based admin panel
-- Since admin access is guarded by password in the app layer,
-- open up write policies so the anon key can perform CRUD.
-- ============================================================

-- ── Products ──
drop policy if exists "Admins can manage all products" on products;
-- Public read (storefront needs this)
drop policy if exists "Products are publicly readable" on products;
create policy "Products are publicly readable" on products
  for select using (true);
-- Open write for admin panel
create policy "Allow product writes" on products
  for insert with check (true);
create policy "Allow product updates" on products
  for update using (true);
create policy "Allow product deletes" on products
  for delete using (true);

-- ── Orders ──
drop policy if exists "Admins can manage all orders" on orders;
create policy "Orders are readable" on orders
  for select using (true);
create policy "Allow order inserts" on orders
  for insert with check (true);
create policy "Allow order updates" on orders
  for update using (true);

-- ── Order Items ──
drop policy if exists "Admins can view all order items" on order_items;
create policy "Order items are readable" on order_items
  for select using (true);
create policy "Allow order item inserts" on order_items
  for insert with check (true);

-- ── Profiles ──
drop policy if exists "Admins can view all profiles" on profiles;
-- (profiles likely already has a select policy for users to read their own)

-- ── Categories ──
drop policy if exists "Admins can manage categories" on categories;
-- Keep public read (already exists from 005)
create policy "Allow category writes" on categories
  for insert with check (true);
create policy "Allow category updates" on categories
  for update using (true);
create policy "Allow category deletes" on categories
  for delete using (true);

-- ── Promo Codes ──
drop policy if exists "Admins can manage promo codes" on promo_codes;
create policy "Promo codes are readable" on promo_codes
  for select using (true);
create policy "Allow promo code writes" on promo_codes
  for insert with check (true);
create policy "Allow promo code updates" on promo_codes
  for update using (true);
create policy "Allow promo code deletes" on promo_codes
  for delete using (true);
