import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
  const { get } = useSiteSettings();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo-text">aira</span>
          <span className="logo-sub">t h e &nbsp; e d i t</span>
          <p>
            A thoughtfully curated clothing brand for the modern woman. Pieces chosen with
            intention, worn with grace.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop?cat=dresses">Dresses</Link></li>
            <li><Link to="/shop?cat=tops">Tops</Link></li>
            <li><Link to="/shop?cat=bottoms">Bottoms</Link></li>
            <li><Link to="/shop?cat=outerwear">Outerwear</Link></li>
            <li><Link to="/shop?cat=accessories">Accessories</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><Link to="/info#size-guide">Size Guide</Link></li>
            <li><Link to="/info#shipping">Shipping &amp; Returns</Link></li>
            <li><Link to="/info#faq">FAQ</Link></li>
            <li><Link to="/info#contact">Contact Us</Link></li>
            <li><Link to="/account">Track Order</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/lookbook">Lookbook</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/about">Sustainability</Link></li>
            <li><a href="mailto:hello@theairaedit.com">Careers</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} The Aira Edit. All rights reserved.</p>
        <div className="social-links">
          {get('social_instagram') && <a href={get('social_instagram')} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {get('social_pinterest') && <a href={get('social_pinterest')} target="_blank" rel="noopener noreferrer">Pinterest</a>}
          {get('social_tiktok') && <a href={get('social_tiktok')} target="_blank" rel="noopener noreferrer">TikTok</a>}
        </div>
        <p><Link to="/info#privacy">Privacy Policy</Link> &middot; <Link to="/info#terms">Terms of Service</Link></p>
      </div>
    </footer>
  );
}
