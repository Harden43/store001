import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function MarqueeStrip() {
  const { get } = useSiteSettings();
  const items = get('marquee_messages').split(',').map((s) => s.trim()).filter(Boolean);

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
