-- ============================================================
-- THE AIRA EDIT — Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ── CATEGORIES ────────────────────────────────────────────
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ── PRODUCTS ──────────────────────────────────────────────
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  category_id uuid references categories(id),
  images text[] default '{}',
  sizes text[] default '{}',
  colors jsonb default '[]', -- [{name, hex}]
  stock_quantity int default 0,
  is_featured boolean default false,
  is_active boolean default true,
  tags text[] default '{}',
  care_instructions text,
  material text,
  created_at timestamptz default now()
);
alter table products enable row level security;
create policy "Products are public" on products for select using (is_active = true);

create index on products(category_id);
create index on products(is_featured);
create index on products(slug);

-- ── WISHLISTS ─────────────────────────────────────────────
create table wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table wishlists enable row level security;
create policy "Users can manage own wishlist" on wishlists
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── ORDERS ────────────────────────────────────────────────
create type order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create table orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text unique not null default 'AE-' || substr(md5(random()::text), 1, 8),
  user_id uuid references profiles(id),
  status order_status default 'pending',
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) default 0,
  discount_amount numeric(10,2) default 0,
  total numeric(10,2) not null,
  stripe_payment_intent_id text,
  stripe_session_id text,
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);

-- ── ORDER ITEMS ───────────────────────────────────────────
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  product_image text,
  quantity int not null,
  unit_price numeric(10,2) not null,
  size text,
  color text,
  created_at timestamptz default now()
);
alter table order_items enable row level security;
create policy "Users can view own order items" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
  );

-- ── PROMO CODES ───────────────────────────────────────────
create table promo_codes (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order_value numeric(10,2) default 0,
  max_uses int,
  current_uses int default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ── ADMIN POLICIES ────────────────────────────────────────
-- Admin role via custom claim; check auth.jwt() ->> 'role' = 'admin'
create policy "Admins can do anything on products" on products
  for all using ((auth.jwt() ->> 'role') = 'admin');

create policy "Admins can do anything on orders" on orders
  for all using ((auth.jwt() ->> 'role') = 'admin');

-- ── TRIGGER: auto-create profile on signup ────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── SEED: Categories ──────────────────────────────────────
insert into categories (name, slug, sort_order) values
  ('Dresses', 'dresses', 1),
  ('Tops', 'tops', 2),
  ('Bottoms', 'bottoms', 3),
  ('Outerwear', 'outerwear', 4),
  ('Accessories', 'accessories', 5);
