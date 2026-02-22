import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useSiteSettings';

function BotanicalSvg() {
  return (
    <svg viewBox="0 0 200 400" className="botanical-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#c9a84c" strokeWidth="1" fill="none" opacity="0.8">
        <path d="M100 380 C100 380 95 320 80 280 C65 240 40 220 30 180 C20 140 45 110 60 90 C75 70 85 60 90 40" />
        <path d="M100 380 C100 380 105 320 120 280 C135 240 140 210 130 170" />
        {/* Leaves */}
        <path d="M80 280 C60 260 30 265 20 245 C35 235 65 245 80 265" />
        <path d="M65 240 C45 215 15 218 5 198 C22 190 55 202 65 225" />
        <path d="M50 200 C35 178 10 175 2 155 C18 150 48 165 50 188" />
        <path d="M45 160 C35 138 15 130 10 112 C24 110 48 125 45 148" />
        <path d="M55 120 C50 100 55 78 60 60 C68 75 68 98 60 115" />
        {/* Right side leaves */}
        <path d="M120 280 C140 258 165 265 175 245 C160 234 132 248 120 265" />
        <path d="M130 240 C148 218 172 220 180 200 C165 193 138 208 130 228" />
        {/* Berries */}
        <circle cx="85" cy="42" r="4" />
        <circle cx="92" cy="34" r="3" />
        <circle cx="78" cy="36" r="3.5" />
        <circle cx="12" cy="148" r="3" />
        <circle cx="178" cy="196" r="3" />
        {/* Flowers */}
        <circle cx="22" cy="244" r="6" />
        <circle cx="22" cy="244" r="10" strokeDasharray="3 4" />
        <circle cx="178" cy="244" r="6" />
        <circle cx="178" cy="244" r="10" strokeDasharray="3 4" />
      </g>
    </svg>
  );
}

export default function HeroSection() {
  const { get } = useSiteSettings();

  return (
    <section className="hero">
      <div className="hero-texture" />

      {/* Botanical Left */}
      <div className="hero-botanical-left">
        <BotanicalSvg />
      </div>

      {/* Botanical Right */}
      <div className="hero-botanical-right">
        <BotanicalSvg />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">{get('hero_eyebrow')}</p>
        <span className="hero-title-the">the</span>
        <span className="hero-title-aira">aira</span>
        <span className="hero-title-edit">e d i t</span>
        <div className="hero-divider" />
        <p className="hero-tagline">{get('hero_tagline')}</p>
        <div className="hero-cta-group">
          <Link to={get('hero_cta_primary_link')} className="btn-primary">{get('hero_cta_primary_text')}</Link>
          <Link to={get('hero_cta_secondary_link')} className="btn-outline">{get('hero_cta_secondary_text')}</Link>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Discover</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
