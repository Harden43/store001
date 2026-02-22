import { create } from 'zustand';
import { adminApi } from '../lib/adminApi';
import type { Product, Category, AdminOrder, AdminStats, OrderStatus } from '../types';

interface AdminStore {
  // Dashboard
  stats: AdminStats | null;
  recentOrders: AdminOrder[];
  lowStockProducts: Product[];

  // Products
  products: Product[];
  productsLoading: boolean;

  // Orders
  orders: AdminOrder[];
  ordersLoading: boolean;

  // Categories
  categories: Category[];
  categoriesLoading: boolean;

  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchOrders: (statusFilter?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;

  // Product CRUD
  createProduct: (data: Record<string, unknown>) => Promise<Product | null>;
  updateProduct: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductField: (id: string, field: 'is_active' | 'is_featured', value: boolean) => Promise<void>;

  // Order
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateOrderNotes: (id: string, notes: string) => Promise<void>;

  // Category CRUD
  createCategory: (data: Record<string, unknown>) => Promise<void>;
  updateCategory: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  recentOrders: [],
  lowStockProducts: [],
  products: [],
  productsLoading: false,
  orders: [],
  ordersLoading: false,
  categories: [],
  categoriesLoading: false,

  fetchDashboardData: async () => {
    const res = await adminApi<{
      stats: AdminStats;
      recentOrders: AdminOrder[];
      lowStockProducts: Product[];
    }>('dashboard');

    set({
      stats: res.stats,
      recentOrders: res.recentOrders,
      lowStockProducts: res.lowStockProducts,
    });
  },

  fetchProducts: async () => {
    set({ productsLoading: true });
    const { data } = await adminApi<{ data: Product[] }>('products');
    set({ products: data, productsLoading: false });
  },

  fetchOrders: async (statusFilter) => {
    set({ ordersLoading: true });
    const { data } = await adminApi<{ data: AdminOrder[] }>('orders', {
      statusFilter,
    });
    set({ orders: data, ordersLoading: false });
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true });
    const { data } = await adminApi<{ data: Category[] }>('categories');
    set({ categories: data, categoriesLoading: false });
  },

  // Product CRUD
  createProduct: async (data) => {
    const res = await adminApi<{ data: Product }>('create-product', { data });
    get().fetchProducts();
    return res.data;
  },

  updateProduct: async (id, data) => {
    await adminApi('update-product', { id, data });
    get().fetchProducts();
  },

  deleteProduct: async (id) => {
    await adminApi('delete-product', { id });
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  toggleProductField: async (id, field, value) => {
    // Optimistic update
    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
    try {
      await adminApi('toggle-product', { id, field, value });
    } catch {
      // Revert on error
      set({
        products: get().products.map((p) =>
          p.id === id ? { ...p, [field]: !value } : p
        ),
      });
    }
  },

  // Orders
  updateOrderStatus: async (id, status) => {
    // Optimistic
    set({
      orders: get().orders.map((o) =>
        o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o
      ),
    });
    await adminApi('update-order-status', { id, status });
  },

  updateOrderNotes: async (id, notes) => {
    await adminApi('update-order-notes', { id, notes });
  },

  // Categories
  createCategory: async (data) => {
    await adminApi('create-category', { data });
    get().fetchCategories();
  },

  updateCategory: async (id, data) => {
    await adminApi('update-category', { id, data });
    get().fetchCategories();
  },

  deleteCategory: async (id) => {
    await adminApi('delete-category', { id });
    set({ categories: get().categories.filter((c) => c.id !== id) });
  },
}));
