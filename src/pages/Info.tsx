import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const SIZES = [
  { size: 'XS', bust: '31-32', waist: '24-25', hips: '34-35' },
  { size: 'S', bust: '33-34', waist: '26-27', hips: '36-37' },
  { size: 'M', bust: '35-36', waist: '28-29', hips: '38-39' },
  { size: 'L', bust: '37-39', waist: '30-32', hips: '40-42' },
  { size: 'XL', bust: '40-42', waist: '33-35', hips: '43-45' },
  { size: 'XXL', bust: '43-45', waist: '36-38', hips: '46-48' },
];

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout.' },
  { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery. Items must be unworn, unwashed, and with original tags attached.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship to most countries worldwide. International orders typically arrive within 10-15 business days.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also check your order status in your account.' },
  { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. Please contact us immediately if you need changes.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and digital wallets through our secure payment system.' },
];

export default function Info() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [hash]);

  return (
    <div className="page">
      <SEO title="Help & Info" description="Size guide, shipping, FAQs, and policies for The Aira Edit." />
      <div className="info-page">
        <div className="page-header">
          <span className="section-eyebrow">Help</span>
          <h1 className="section-title">Information <em>&amp; Policies</em></h1>
          <div className="section-rule" />
        </div>

        {/* Size Guide */}
        <section id="size-guide" className="info-section">
          <h2 className="info-heading">Size Guide</h2>
          <p className="info-text">All measurements are in inches. For the best fit, measure yourself and compare to the chart below.</p>
          <div className="info-table-wrap">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust</th>
                  <th>Waist</th>
                  <th>Hips</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s) => (
                  <tr key={s.size}>
                    <td><strong>{s.size}</strong></td>
                    <td>{s.bust}"</td>
                    <td>{s.waist}"</td>
                    <td>{s.hips}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Shipping & Returns */}
        <section id="shipping" className="info-section">
          <h2 className="info-heading">Shipping &amp; Returns</h2>
          <div className="info-columns">
            <div>
              <h3 className="info-subheading">Shipping</h3>
              <ul className="info-list">
                <li>Free standard shipping on orders over $100</li>
                <li>Standard shipping: 5-7 business days</li>
                <li>Express shipping: 2-3 business days</li>
                <li>International shipping: 10-15 business days</li>
                <li>Tracking provided via email once shipped</li>
              </ul>
            </div>
            <div>
              <h3 className="info-subheading">Returns</h3>
              <ul className="info-list">
                <li>14-day return window from delivery date</li>
                <li>Items must be unworn with tags attached</li>
                <li>Free returns for domestic orders</li>
                <li>Refund processed within 5-7 business days</li>
                <li>Exchanges subject to availability</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="info-section">
          <h2 className="info-heading">Frequently Asked Questions</h2>
          <div className="info-faq-list">
            {FAQS.map((faq, i) => (
              <details key={i} className="info-faq">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="info-section">
          <h2 className="info-heading">Contact Us</h2>
          <p className="info-text">
            We'd love to hear from you. Reach out and we'll get back within 24 hours.
          </p>
          <div className="info-contact-grid">
            <div className="info-contact-card">
              <span className="info-contact-icon">&#x2709;</span>
              <h3 className="info-subheading">Email</h3>
              <a href="mailto:hello@theairaedit.com" className="info-contact-link">hello@theairaedit.com</a>
            </div>
            <div className="info-contact-card">
              <span className="info-contact-icon">&#x260E;</span>
              <h3 className="info-subheading">Phone</h3>
              <span className="info-contact-link">Mon-Fri, 9am-6pm IST</span>
            </div>
          </div>
        </section>

        {/* Policies */}
        <section id="privacy" className="info-section">
          <h2 className="info-heading">Privacy Policy</h2>
          <p className="info-text">
            We respect your privacy. Your personal information is used solely for order processing,
            communication, and improving your experience. We never sell or share your data with third
            parties for marketing purposes. Payment information is processed securely through our
            payment partner and is never stored on our servers.
          </p>
        </section>

        <section id="terms" className="info-section">
          <h2 className="info-heading">Terms of Service</h2>
          <p className="info-text">
            By using The Aira Edit, you agree to these terms. All products are subject to availability.
            Prices may change without notice. We reserve the right to refuse or cancel orders at our
            discretion. Product images are representative and slight variations may occur.
            All content on this site is the property of The Aira Edit and may not be reproduced
            without permission.
          </p>
        </section>
      </div>
    </div>
  );
}
