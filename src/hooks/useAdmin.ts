import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';

export function useAdminDashboard() {
  const { stats, recentOrders, lowStockProducts, fetchDashboardData } = useAdminStore();
  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);
  return { stats, recentOrders, lowStockProducts, loading: !stats };
}

export function useAdminProducts() {
  const store = useAdminStore();
  useEffect(() => { store.fetchProducts(); }, []);
  return {
    products: store.products,
    loading: store.productsLoading,
    createProduct: store.createProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    toggleProductField: store.toggleProductField,
    refetch: store.fetchProducts,
  };
}

export function useAdminOrders(statusFilter?: string) {
  const store = useAdminStore();
  useEffect(() => { store.fetchOrders(statusFilter); }, [statusFilter]);
  return {
    orders: store.orders,
    loading: store.ordersLoading,
    updateOrderStatus: store.updateOrderStatus,
    refetch: () => store.fetchOrders(statusFilter),
  };
}

export function useAdminCategories() {
  const store = useAdminStore();
  useEffect(() => { store.fetchCategories(); }, []);
  return {
    categories: store.categories,
    loading: store.categoriesLoading,
    createCategory: store.createCategory,
    updateCategory: store.updateCategory,
    deleteCategory: store.deleteCategory,
    refetch: store.fetchCategories,
  };
}
