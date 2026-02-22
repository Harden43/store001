import { Link } from 'react-router-dom';

const CATEGORIES = [
  { slug: 'dresses', label: 'Dresses &\nJumpsuits', eyebrow: 'Featured', cls: 'cat-1' },
  { slug: 'tops', label: 'Tops', eyebrow: 'Everyday', cls: 'cat-2' },
  { slug: 'bottoms', label: 'Bottoms', eyebrow: 'Effortless', cls: 'cat-3' },
  { slug: 'outerwear', label: 'Outerwear', eyebrow: 'Layer Up', cls: 'cat-4' },
  { slug: 'accessories', label: 'Accessories', eyebrow: 'Complete', cls: 'cat-5' },
];

export default function Categories() {
  return (
    <section className="categories">
      <div className="section-header">
        <span className="section-eyebrow">Browse by</span>
        <h2 className="section-title">Shop <em>the categories</em></h2>
        <div className="section-rule" />
      </div>

      <div className="categories-grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?cat=${cat.slug}`}
            className={`cat-item ${cat.cls}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="cat-bg">
              <div className="cat-label">
                <span className="eyebrow">{cat.eyebrow}</span>
                <h3>{cat.label.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && cat.label.includes('\n') && <br />}</span>
                ))}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
