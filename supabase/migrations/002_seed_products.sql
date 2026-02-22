-- ============================================================
-- THE AIRA EDIT — Seed Products + Fix Policies
-- ============================================================

-- ── Fix: allow profile creation for new users (safety net) ──
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- ── Seed: Products ──────────────────────────────────────────

-- Tops
insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Linen Wrap Blouse', 'linen-wrap-blouse',
  'A breathable linen blouse with a flattering wrap silhouette. Designed to drape beautifully and transition from day to evening effortlessly.',
  89, null,
  (select id from categories where slug = 'tops'),
  ARRAY['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L','XL'],
  '[{"name":"Sage","hex":"#8a9c85"},{"name":"Sand","hex":"#c5b5a5"},{"name":"Noir","hex":"#2c2c2c"}]'::jsonb,
  24, true, true,
  ARRAY['new','linen','bestseller'],
  'Hand wash cold, lay flat to dry', '100% European Linen',
  '2026-02-01T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Silk Camisole', 'silk-camisole',
  'A luxuriously soft silk camisole with delicate spaghetti straps. Perfect for layering under blazers or wearing on its own.',
  68, null,
  (select id from categories where slug = 'tops'),
  ARRAY['https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L'],
  '[{"name":"Cream","hex":"#f5efe6"},{"name":"Blush","hex":"#d4a5a5"},{"name":"Champagne","hex":"#c9a84c"}]'::jsonb,
  18, false, true,
  ARRAY['silk','layering'],
  'Dry clean recommended', '100% Mulberry Silk',
  '2026-01-28T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Oversized Cotton Tee', 'oversized-cotton-tee',
  'Premium organic cotton in a relaxed oversized cut. The perfect foundation piece — soft, breathable, and endlessly versatile.',
  52, null,
  (select id from categories where slug = 'tops'),
  ARRAY['https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=600&h=800&fit=crop'],
  ARRAY['S','M','L','XL'],
  '[{"name":"White","hex":"#f5f5f5"},{"name":"Oat","hex":"#d4c9bc"},{"name":"Sage","hex":"#8a9c85"}]'::jsonb,
  40, false, true,
  ARRAY['cotton','basics','organic'],
  'Machine wash cold, tumble dry low', '100% Organic Cotton',
  '2026-01-20T00:00:00Z'
);

-- Dresses
insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Midi Slip Dress', 'midi-slip-dress',
  'A timeless midi slip dress in fluid satin. The bias cut follows your natural silhouette while adjustable straps ensure the perfect fit.',
  98, 145,
  (select id from categories where slug = 'dresses'),
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L'],
  '[{"name":"Gold","hex":"#c9a84c"},{"name":"Ivory","hex":"#f5efe6"}]'::jsonb,
  12, true, true,
  ARRAY['sale','satin','bestseller'],
  'Dry clean only', 'Satin-finish Viscose',
  '2026-02-05T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Linen Maxi Dress', 'linen-maxi-dress',
  'A flowing linen maxi dress with a smocked bodice and tiered skirt. Effortlessly romantic, capturing the spirit of a Mediterranean summer.',
  135, null,
  (select id from categories where slug = 'dresses'),
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L','XL'],
  '[{"name":"Olive","hex":"#6a7c65"},{"name":"Cream","hex":"#f5efe6"}]'::jsonb,
  15, true, true,
  ARRAY['new','linen','maxi'],
  'Machine wash cold, line dry', '100% French Linen',
  '2026-02-10T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Knit Wrap Dress', 'knit-wrap-dress',
  'A figure-flattering wrap dress in soft ribbed knit. The perfect desk-to-dinner piece with a self-tie waist and gentle stretch.',
  110, null,
  (select id from categories where slug = 'dresses'),
  ARRAY['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop'],
  ARRAY['S','M','L'],
  '[{"name":"Sage","hex":"#7a8c75"},{"name":"Noir","hex":"#2c2c2c"},{"name":"Taupe","hex":"#b5a090"}]'::jsonb,
  20, false, true,
  ARRAY['knit','wrap'],
  'Hand wash cold, reshape and dry flat', 'Cotton-Viscose Blend',
  '2026-01-15T00:00:00Z'
);

-- Outerwear
insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Botanical Jacket', 'botanical-jacket',
  'A structured linen-blend jacket with a relaxed fit and artisanal botanical embroidery detail. Lined in cotton for year-round layering.',
  210, null,
  (select id from categories where slug = 'outerwear'),
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L'],
  '[{"name":"Forest","hex":"#6a7c65"},{"name":"Charcoal","hex":"#5a5a5a"},{"name":"Sand","hex":"#c5b5a5"}]'::jsonb,
  8, true, true,
  ARRAY['outerwear','embroidered'],
  'Dry clean only', 'Linen-Cotton Blend',
  '2026-02-08T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Wool Blend Coat', 'wool-blend-coat',
  'A beautifully tailored mid-length coat in a warm wool blend. Clean lines, single-breasted closure, and slightly oversized fit.',
  285, 340,
  (select id from categories where slug = 'outerwear'),
  ARRAY['https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop'],
  ARRAY['S','M','L'],
  '[{"name":"Camel","hex":"#c5a882"},{"name":"Noir","hex":"#2c2c2c"}]'::jsonb,
  6, false, true,
  ARRAY['sale','wool','coat'],
  'Professional dry clean', '70% Wool, 30% Polyester',
  '2026-01-05T00:00:00Z'
);

-- Bottoms
insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Pleated Wide-Leg Trousers', 'pleated-wide-leg-trousers',
  'Elegant wide-leg trousers with a high waist and flowing pleats. A sophisticated alternative to jeans.',
  120, null,
  (select id from categories where slug = 'bottoms'),
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'],
  ARRAY['XS','S','M','L','XL'],
  '[{"name":"Taupe","hex":"#b5a090"},{"name":"Ivory","hex":"#f5efe6"},{"name":"Sage","hex":"#8a9c85"}]'::jsonb,
  22, true, true,
  ARRAY['new','trousers'],
  'Machine wash cold, hang to dry', 'Tencel-Linen Blend',
  '2026-02-12T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Linen Palazzo Pants', 'linen-palazzo-pants',
  'Ultra-wide palazzo pants in lightweight linen with an elastic waist and side pockets. Breezy, relaxed, and effortlessly chic.',
  95, null,
  (select id from categories where slug = 'bottoms'),
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop'],
  ARRAY['S','M','L'],
  '[{"name":"White","hex":"#f5f5f5"},{"name":"Natural","hex":"#d4c9bc"}]'::jsonb,
  16, false, true,
  ARRAY['linen','palazzo'],
  'Machine wash cold, line dry', '100% Linen',
  '2026-01-22T00:00:00Z'
);

-- Accessories
insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Woven Leather Tote', 'woven-leather-tote',
  'A hand-woven leather tote with a spacious interior and magnetic closure. Develops a beautiful patina over time.',
  178, null,
  (select id from categories where slug = 'accessories'),
  ARRAY['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop'],
  ARRAY[]::text[],
  '[{"name":"Tan","hex":"#b5a090"},{"name":"Noir","hex":"#2c2c2c"}]'::jsonb,
  10, false, true,
  ARRAY['leather','bag','handcrafted'],
  'Wipe with damp cloth, condition leather seasonally', 'Vegetable-Tanned Leather',
  '2026-02-03T00:00:00Z'
);

insert into products (name, slug, description, price, compare_price, category_id, images, sizes, colors, stock_quantity, is_featured, is_active, tags, care_instructions, material, created_at)
values (
  'Silk Hair Scarf', 'silk-hair-scarf',
  'A versatile pure silk scarf in an original botanical print. Wear it as a hair tie, neck scarf, or bag accessory.',
  42, null,
  (select id from categories where slug = 'accessories'),
  ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop'],
  ARRAY[]::text[],
  '[{"name":"Sage Print","hex":"#7a8c75"},{"name":"Gold Print","hex":"#c9a84c"},{"name":"Rose Print","hex":"#d4a5a5"}]'::jsonb,
  30, false, true,
  ARRAY['silk','scarf','accessory'],
  'Hand wash cold with silk detergent', '100% Mulberry Silk',
  '2026-01-25T00:00:00Z'
);
