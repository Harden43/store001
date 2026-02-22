// src/types/index.ts

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string;
  category?: Category;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  care_instructions: string | null;
  material: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Address {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  size: string | null;
  color: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  stripe_payment_intent_id: string | null;
  shipping_address: Address | null;
  billing_address: Address | null;
  notes: string | null;
  order_items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  is_active: boolean;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// Admin types
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price: number | null;
  category_id: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  care_instructions: string;
  material: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

// Also extend Order for admin views with profile info
export interface AdminOrder extends Order {
  profiles?: { full_name: string | null; email: string; phone: string | null };
}

// Filter types for shop
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'featured';
}
