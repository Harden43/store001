import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="page">
      <SEO title="About" description="Our story — dressed with purpose, worn with grace." />
      <div className="about-page">
        {/* Hero banner */}
        <section className="about-hero">
          <div className="about-hero-bg" />
          <div className="about-hero-content">
            <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Our Story</span>
            <h1 className="about-hero-title">
              Dressed with <em>purpose,</em><br />worn with grace
            </h1>
            <div className="section-rule" style={{ background: 'var(--gold)' }} />
          </div>
        </section>

        {/* Intro */}
        <section className="about-section">
          <div className="about-narrow">
            <p className="about-lead">
              The Aira Edit is a curation of thoughtfully designed pieces that celebrate
              femininity in its quietest, most powerful form.
            </p>
            <p>
              Each garment is chosen for its quality, its story, and the way it moves with
              the women who wear it. We believe clothing is more than fabric — it's a language.
              One that speaks before you do.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="about-values">
          <div className="about-values-header">
            <span className="section-eyebrow">What We Stand For</span>
            <h2 className="section-title">Our <em>Values</em></h2>
            <div className="section-rule" />
          </div>
          <div className="about-values-grid">
            <div className="about-value-card">
              <span className="about-value-num">01</span>
              <h3>Intentional Design</h3>
              <p>Every piece in our collection is carefully selected — not for trends, but for timeless elegance and versatility.</p>
            </div>
            <div className="about-value-card">
              <span className="about-value-num">02</span>
              <h3>Quality Over Quantity</h3>
              <p>We believe in building a wardrobe that lasts. Premium fabrics, impeccable construction, pieces worth keeping.</p>
            </div>
            <div className="about-value-card">
              <span className="about-value-num">03</span>
              <h3>Sustainable Approach</h3>
              <p>Slow fashion is not a trend — it's a responsibility. We partner with makers who share our commitment to the planet.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <span className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Begin Your Journey</span>
          <h2>Discover the <em>collection</em></h2>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </section>
      </div>
    </div>
  );
}
