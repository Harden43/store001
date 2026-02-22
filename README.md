# 🌿 The Aira Edit — E-Commerce Platform

A sophisticated clothing brand e-commerce app built with React + TypeScript + Supabase.

**Color palette:** Sage green `#7a8c75` · Gold `#c9a84c` · Cream `#f5efe6`

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Enable Storage and create a bucket named `product-images` (public)

### 3. Configure environment
```bash
cp .env.example .env
# Fill in your Supabase URL, anon key, and Stripe key
```

### 4. Run the dev server
```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, CartDrawer
│   ├── ui/           # Button, ProductCard, Badge, ImageGallery
│   └── home/         # HeroSection, FeaturedCollection, BrandStory
├── pages/
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Account.tsx
│   └── Admin/        # Dashboard, Products, Orders
├── lib/
│   └── supabase.ts
├── store/
│   ├── cartStore.ts   # Zustand cart (persisted)
│   └── authStore.ts   # Zustand auth
├── hooks/
│   ├── useProducts.ts
│   └── useAuth.ts
└── types/
    └── index.ts
```

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `profiles` | User accounts (auto-created on signup) |
| `categories` | Dresses, Tops, Bottoms, Outerwear, Accessories |
| `products` | Full product catalog with images, sizes, colors |
| `orders` | Order lifecycle with Stripe integration |
| `order_items` | Line items per order |
| `wishlists` | User-saved products |
| `promo_codes` | Discount codes |

---

## ✨ Features

- **Customer-facing:** Product catalog, filtering, search, product detail, cart drawer, checkout with Stripe, account/orders
- **Admin panel:** Product CRUD with image upload, order management, analytics dashboard
- **Auth:** Supabase Auth (email/password + magic link)
- **Performance:** Lazy loaded images, optimistic UI, persisted cart

---

## 🎨 Design System

Fonts: **Cormorant Garamond** (display, italic) + **Cinzel** (labels) + **Jost** (body)

```css
--sage: #7a8c75
--sage-dark: #5a6b56
--gold: #c9a84c
--cream: #f5efe6
```

---

## 📦 Deployment

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or Cloudflare Pages
# Add your env vars in the dashboard
```
