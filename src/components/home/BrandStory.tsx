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
        <Link to="/about" className="btn-outline">Our Story &rarr;</Link>
      </div>

      <div className="brand-story-visual">
        <div className="brand-story-gold-frame" />
        <div className="brand-story-img-main">
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#8a9c85 0%,#6a7c65 40%,#5a6b56 100%)', position: 'relative', overflow: 'hidden' }}>
            {/* Elegant abstract fabric drape pattern */}
            <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" fill="none" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <linearGradient id="fabric1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(245,239,230,0.12)" />
                  <stop offset="100%" stopColor="rgba(201,168,76,0.08)" />
                </linearGradient>
                <linearGradient id="fabric2" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(201,168,76,0.15)" />
                  <stop offset="100%" stopColor="rgba(245,239,230,0.05)" />
                </linearGradient>
              </defs>
              {/* Flowing curves suggesting draped fabric */}
              <path d="M0 150 C80 120 120 200 200 180 C280 160 320 100 400 130 L400 350 C320 320 280 400 200 380 C120 360 80 280 0 310 Z" fill="url(#fabric1)" />
              <path d="M0 250 C100 220 150 320 250 290 C350 260 380 200 400 220 L400 450 C380 430 350 500 250 470 C150 440 100 360 0 380 Z" fill="url(#fabric2)" />
              <path d="M0 400 C60 380 140 440 200 420 C260 400 340 360 400 390 L400 550 C340 530 260 560 200 540 C140 520 60 500 0 520 Z" fill="url(#fabric1)" />
              {/* Thin gold accent lines */}
              <path d="M50 0 C100 150 180 250 150 600" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
              <path d="M200 0 C220 200 160 350 250 600" stroke="rgba(201,168,76,0.1)" strokeWidth="1" />
              <path d="M350 0 C300 180 330 350 280 600" stroke="rgba(201,168,76,0.08)" strokeWidth="1" />
            </svg>
            {/* Brand monogram */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '4.5rem', color: 'rgba(245,239,230,0.1)', letterSpacing: '0.15em', fontWeight: 400 }}>A</span>
            </div>
          </div>
        </div>
        <div className="brand-story-img-accent">
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Abstract botanical / leaf motif */}
            <svg viewBox="0 0 120 120" width="70" fill="none">
              <path d="M60 15 C40 35 30 55 35 80 C38 95 50 105 60 105 C70 105 82 95 85 80 C90 55 80 35 60 15Z" stroke="rgba(245,239,230,0.45)" strokeWidth="1.2" />
              <path d="M60 25 L60 95" stroke="rgba(245,239,230,0.3)" strokeWidth="0.8" />
              <path d="M60 45 C50 50 42 58 40 68" stroke="rgba(245,239,230,0.2)" strokeWidth="0.8" />
              <path d="M60 45 C70 50 78 58 80 68" stroke="rgba(245,239,230,0.2)" strokeWidth="0.8" />
              <path d="M60 60 C52 63 46 70 44 78" stroke="rgba(245,239,230,0.15)" strokeWidth="0.8" />
              <path d="M60 60 C68 63 74 70 76 78" stroke="rgba(245,239,230,0.15)" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
