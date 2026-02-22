import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="brand-story">
      <div className="brand-story-text">
        <span className="eyebrow">Our Philosophy</span>
        <h2>Dressed with <em>purpose,</em><br />worn with grace</h2>
        <p>
          The Aira Edit is a curation of thoughtfully designed pieces that celebrate femininity in
          its quietest, most powerful form. Each garment is chosen for its quality, its story, and
          the way it moves with the women who wear it.
        </p>
        <p>
          We believe clothing is more than fabric — it's a language. One that speaks before you do.
        </p>
        <Link to="/shop" className="btn-outline">Our Story &rarr;</Link>
      </div>

      <div className="brand-story-visual">
        <div className="brand-story-gold-frame" />
        <div className="brand-story-img-main">
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#8a9c85 0%,#6a7c65 40%,#5a6b56 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
              <circle cx="60" cy="35" r="20" fill="rgba(245,239,230,0.3)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
              <path d="M40 60 C40 55 45 50 60 50 C75 50 80 55 80 60 L85 140 C85 145 80 150 60 150 C40 150 35 145 35 140 Z" fill="rgba(245,239,230,0.25)" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
              <path d="M35 140 L25 190" stroke="rgba(245,239,230,0.3)" strokeWidth="8" strokeLinecap="round" />
              <path d="M85 140 L95 190" stroke="rgba(245,239,230,0.3)" strokeWidth="8" strokeLinecap="round" />
              <path d="M40 75 L15 100" stroke="rgba(245,239,230,0.3)" strokeWidth="8" strokeLinecap="round" />
              <path d="M80 75 L105 100" stroke="rgba(245,239,230,0.3)" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="brand-story-img-accent">
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" width="60" fill="none">
              <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10Z" stroke="rgba(245,239,230,0.5)" strokeWidth="1" />
              <path d="M50 20 L52 46 L78 50 L52 54 L50 80 L48 54 L22 50 L48 46 Z" fill="rgba(245,239,230,0.4)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
