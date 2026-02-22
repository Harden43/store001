-- Journal posts table
create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  category text,
  cover_image_url text,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

alter table public.journal_posts enable row level security;

drop policy if exists "Public can read published posts" on public.journal_posts;
create policy "Public can read published posts"
  on public.journal_posts for select using (is_published = true);

-- Site settings table (key-value)
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
  on public.site_settings for select using (true);

-- Seed default homepage content
insert into public.site_settings (key, value) values
  ('hero_eyebrow', 'New Season Arrivals — Spring 2026'),
  ('hero_tagline', 'Curated pieces for the woman who moves with intention'),
  ('hero_cta_primary_text', 'Shop the Edit'),
  ('hero_cta_primary_link', '/shop'),
  ('hero_cta_secondary_text', 'View Lookbook'),
  ('hero_cta_secondary_link', '/lookbook'),
  ('marquee_messages', 'New Arrivals,Free Shipping Over $150,Spring Collection 2026,Curated with Care,Ethically Sourced'),
  ('brand_story_eyebrow', 'Our Philosophy'),
  ('brand_story_heading', 'Dressed with purpose, worn with grace'),
  ('brand_story_paragraph_1', 'The Aira Edit is a curation of thoughtfully designed pieces that celebrate femininity in its quietest, most powerful form. Each garment is chosen for its quality, its story, and the way it moves with the women who wear it.'),
  ('brand_story_paragraph_2', 'We believe clothing is more than fabric — it''s a language. One that speaks before you do.'),
  ('brand_story_cta_text', 'Our Story'),
  ('brand_story_cta_link', '/about')
on conflict (key) do nothing;
