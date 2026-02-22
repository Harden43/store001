import { Link } from 'react-router-dom';

export default function Footer() {
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
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Shipping &amp; Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/lookbook">Lookbook</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} The Aira Edit. All rights reserved.</p>
        <div className="social-links">
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
          <a href="#">TikTok</a>
        </div>
        <p>Privacy Policy &middot; Terms of Service</p>
      </div>
    </footer>
  );
}
