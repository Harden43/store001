import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import ScrollToTop from './ScrollToTop';
import ToastContainer from './ToastContainer';
import CookieConsent from './CookieConsent';
import BackToTop from '../ui/BackToTop';
import ErrorBoundary from '../ErrorBoundary';

export default function StorefrontLayout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <ErrorBoundary>
      <>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <ScrollToTop />
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <CartDrawer />
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        <ToastContainer />
        <main id="main-content"><Outlet /></main>
        <Footer />
        <CookieConsent />
        <BackToTop />
      </>
    </ErrorBoundary>
  );
}
