const items = [
  'New Arrivals',
  'Free Shipping Over $150',
  'Spring Collection 2026',
  'Curated with Care',
  'Ethically Sourced',
];

export default function MarqueeStrip() {
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {/* Duplicate for seamless loop */}
        {[...items, ...items].map((text, i) => (
          <span key={i} className="marquee-item">
            {text} <span className="marquee-dot">&#x2726;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
