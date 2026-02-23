import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import StorefrontLayout from './components/layout/StorefrontLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Collections from './pages/Collections';
import Lookbook from './pages/Lookbook';
import About from './pages/About';
import Journal from './pages/Journal';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Info from './pages/Info';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import AdminGuard from './components/admin/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';
import { useAuthStore } from './store/authStore';

// Lazy-load admin pages (not needed for regular shoppers)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminPromoCodes = lazy(() => import('./pages/admin/AdminPromoCodes'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminJournal = lazy(() => import('./pages/admin/AdminJournal'));
const AdminJournalForm = lazy(() => import('./pages/admin/AdminJournalForm'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Suspense fallback={<div className="admin-loading"><div className="admin-loading-spinner" /></div>}>
      <Routes>
        {/* Admin routes — separate layout, no Navbar/Footer */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="promo-codes" element={<AdminPromoCodes />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="journal" element={<AdminJournal />} />
            <Route path="journal/new" element={<AdminJournalForm />} />
            <Route path="journal/:id/edit" element={<AdminJournalForm />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Storefront routes — with Navbar/Footer */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:slug" element={<ProductDetail />} />
          <Route path="collections" element={<Collections />} />
          <Route path="lookbook" element={<Lookbook />} />
          <Route path="about" element={<About />} />
          <Route path="journal" element={<Journal />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
