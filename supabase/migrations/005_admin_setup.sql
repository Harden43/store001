-- ============================================================
-- Admin Panel Setup
-- ============================================================

-- 1. Add is_admin column to profiles
alter table profiles add column if not exists is_admin boolean default false;

-- 2. Set initial admin
update profiles set is_admin = true where email = 'dev.prajwolkc@gmail.com';

-- 3. Helper function to check admin status (bypasses RLS via security definer)
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid()),
    false
  );
$$;

-- 4. Replace old JWT-based admin policies with is_admin()-based ones

-- Products
drop policy if exists "Admins can do anything on products" on products;
create policy "Admins can manage all products" on products
  for all using (is_admin());

-- Orders
drop policy if exists "Admins can do anything on orders" on orders;
create policy "Admins can manage all orders" on orders
  for all using (is_admin());

-- Order items (admin read access)
create policy "Admins can view all order items" on order_items
  for select using (is_admin());

-- Profiles (admin can read all)
create policy "Admins can view all profiles" on profiles
  for select using (is_admin());

-- 5. Add RLS to categories (currently unprotected)
alter table categories enable row level security;
create policy "Categories are publicly readable" on categories
  for select using (true);
create policy "Admins can manage categories" on categories
  for all using (is_admin());

-- 6. Add RLS to promo_codes
alter table promo_codes enable row level security;
create policy "Admins can manage promo codes" on promo_codes
  for all using (is_admin());
