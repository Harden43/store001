-- Newsletter subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  is_active boolean default true
);

-- Anyone can insert (subscribe), but only admins can read/delete
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

drop policy if exists "Admins can view subscribers" on public.newsletter_subscribers;
create policy "Admins can view subscribers"
  on public.newsletter_subscribers for select
  using (public.is_admin());
