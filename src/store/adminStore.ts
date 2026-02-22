import { create } from 'zustand';
import { adminApi } from '../lib/adminApi';
import type { Product, Category, AdminOrder, AdminStats, OrderStatus, PromoCode, NewsletterSubscriber, JournalPost, CustomerProfile } from '../types';

interface AdminStore {
  stats: AdminStats | null;
  recentOrders: AdminOrder[];
  lowStockProducts: Product[];
  products: Product[];
  productsLoading: boolean;
  orders: AdminOrder[];
  ordersLoading: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  promoCodes: PromoCode[];
  promoCodesLoading: boolean;
  subscribers: NewsletterSubscriber[];
  subscribersLoading: boolean;
  customers: CustomerProfile[];
  customersLoading: boolean;
  journalPosts: JournalPost[];
  journalLoading: boolean;
  siteSettings: Record<string, string>;
  settingsLoading: boolean;

  fetchDashboardData: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchOrders: (statusFilter?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createProduct: (data: Record<string, unknown>) => Promise<Product | null>;
  updateProduct: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductField: (id: string, field: 'is_active' | 'is_featured', value: boolean) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateOrderNotes: (id: string, notes: string) => Promise<void>;
  createCategory: (data: Record<string, unknown>) => Promise<void>;
  updateCategory: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  fetchPromoCodes: () => Promise<void>;
  createPromoCode: (data: Record<string, unknown>) => Promise<void>;
  updatePromoCode: (id: string, data: Record<string, unknown>) => Promise<void>;
  deletePromoCode: (id: string) => Promise<void>;
  fetchSubscribers: () => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
  fetchCustomers: () => Promise<void>;
  toggleAdmin: (id: string, value: boolean) => Promise<void>;
  fetchJournalPosts: () => Promise<void>;
  createJournalPost: (data: Record<string, unknown>) => Promise<JournalPost | null>;
  updateJournalPost: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteJournalPost: (id: string) => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: { key: string; value: string }[]) => Promise<void>;
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
  promoCodes: [],
  promoCodesLoading: false,
  subscribers: [],
  subscribersLoading: false,
  customers: [],
  customersLoading: false,
  journalPosts: [],
  journalLoading: false,
  siteSettings: {},
  settingsLoading: false,

  fetchDashboardData: async () => {
    const res = await adminApi<{
      stats: AdminStats;
      recentOrders: AdminOrder[];
      lowStockProducts: Product[];
    }>('dashboard');
    set({ stats: res.stats, recentOrders: res.recentOrders, lowStockProducts: res.lowStockProducts });
  },

  fetchProducts: async () => {
    set({ productsLoading: true });
    const { data } = await adminApi<{ data: Product[] }>('products');
    set({ products: data, productsLoading: false });
  },

  fetchOrders: async (statusFilter) => {
    set({ ordersLoading: true });
    const { data } = await adminApi<{ data: AdminOrder[] }>('orders', { statusFilter });
    set({ orders: data, ordersLoading: false });
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true });
    const { data } = await adminApi<{ data: Category[] }>('categories');
    set({ categories: data, categoriesLoading: false });
  },

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
    set({ products: get().products.map((p) => p.id === id ? { ...p, [field]: value } : p) });
    try {
      await adminApi('toggle-product', { id, field, value });
    } catch {
      set({ products: get().products.map((p) => p.id === id ? { ...p, [field]: !value } : p) });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ orders: get().orders.map((o) => o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o) });
    await adminApi('update-order-status', { id, status });
  },

  updateOrderNotes: async (id, notes) => {
    await adminApi('update-order-notes', { id, notes });
  },

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

  // Promo Codes
  fetchPromoCodes: async () => {
    set({ promoCodesLoading: true });
    const { data } = await adminApi<{ data: PromoCode[] }>('promo-codes');
    set({ promoCodes: data, promoCodesLoading: false });
  },

  createPromoCode: async (data) => {
    await adminApi('create-promo-code', { data });
    get().fetchPromoCodes();
  },

  updatePromoCode: async (id, data) => {
    await adminApi('update-promo-code', { id, data });
    get().fetchPromoCodes();
  },

  deletePromoCode: async (id) => {
    await adminApi('delete-promo-code', { id });
    set({ promoCodes: get().promoCodes.filter((p) => p.id !== id) });
  },

  // Subscribers
  fetchSubscribers: async () => {
    set({ subscribersLoading: true });
    const { data } = await adminApi<{ data: NewsletterSubscriber[] }>('subscribers');
    set({ subscribers: data, subscribersLoading: false });
  },

  deleteSubscriber: async (id) => {
    await adminApi('delete-subscriber', { id });
    set({ subscribers: get().subscribers.filter((s) => s.id !== id) });
  },

  // Customers
  fetchCustomers: async () => {
    set({ customersLoading: true });
    const { data } = await adminApi<{ data: CustomerProfile[] }>('customers');
    set({ customers: data, customersLoading: false });
  },

  toggleAdmin: async (id, value) => {
    await adminApi('toggle-admin', { id, value });
    set({ customers: get().customers.map((c) => c.id === id ? { ...c, is_admin: value } : c) });
  },

  // Journal
  fetchJournalPosts: async () => {
    set({ journalLoading: true });
    const { data } = await adminApi<{ data: JournalPost[] }>('journal-posts');
    set({ journalPosts: data, journalLoading: false });
  },

  createJournalPost: async (data) => {
    const res = await adminApi<{ data: JournalPost }>('create-journal-post', { data });
    get().fetchJournalPosts();
    return res.data;
  },

  updateJournalPost: async (id, data) => {
    await adminApi('update-journal-post', { id, data });
    get().fetchJournalPosts();
  },

  deleteJournalPost: async (id) => {
    await adminApi('delete-journal-post', { id });
    set({ journalPosts: get().journalPosts.filter((p) => p.id !== id) });
  },

  // Site Settings
  fetchSettings: async () => {
    set({ settingsLoading: true });
    const { data } = await adminApi<{ data: { key: string; value: string }[] }>('site-settings');
    const map: Record<string, string> = {};
    for (const item of data) map[item.key] = item.value;
    set({ siteSettings: map, settingsLoading: false });
  },

  updateSettings: async (settings) => {
    await adminApi('update-settings', { settings });
    const map = { ...get().siteSettings };
    for (const s of settings) map[s.key] = s.value;
    set({ siteSettings: map });
  },
}));
