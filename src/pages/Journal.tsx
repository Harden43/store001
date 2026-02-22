import SEO from '../components/SEO';
import { useToastStore } from '../store/toastStore';

const POSTS = [
  {
    id: 1,
    title: 'The Art of Slow Fashion',
    excerpt: 'Why choosing fewer, better pieces transforms not just your wardrobe but your relationship with what you wear.',
    category: 'Philosophy',
    date: 'Feb 15, 2026',
    gradient: 'linear-gradient(160deg, #8a9c85, #5a6b56)',
  },
  {
    id: 2,
    title: 'Five Pieces, Endless Possibilities',
    excerpt: 'A capsule wardrobe guide using our latest collection — from morning meetings to evening gatherings.',
    category: 'Style Guide',
    date: 'Feb 8, 2026',
    gradient: 'linear-gradient(160deg, #b5a090, #8a7060)',
  },
  {
    id: 3,
    title: 'Behind the Fabric: Our Material Story',
    excerpt: 'An inside look at the mills and makers who craft the textiles that become your favourite garments.',
    category: 'Behind the Scenes',
    date: 'Jan 28, 2026',
    gradient: 'linear-gradient(160deg, #9aaa95, #6a7c65)',
  },
  {
    id: 4,
    title: 'Dressing with Intention',
    excerpt: 'How mindful dressing can become a daily ritual that centres you before the world rushes in.',
    category: 'Mindfulness',
    date: 'Jan 15, 2026',
    gradient: 'linear-gradient(160deg, #c5b5a5, #9a8a7a)',
  },
  {
    id: 5,
    title: 'The Colour Palette of the Season',
    excerpt: 'Earth tones, sage greens, and muted golds — the hues we are drawn to this season and how to wear them.',
    category: 'Trends',
    date: 'Jan 5, 2026',
    gradient: 'linear-gradient(160deg, #7a8c75, #4a5c46)',
  },
  {
    id: 6,
    title: 'Care Guide: Making Your Pieces Last',
    excerpt: 'Simple care rituals to keep your garments looking beautiful for years — from washing to storage.',
    category: 'Care',
    date: 'Dec 20, 2025',
    gradient: 'linear-gradient(160deg, #a8b8a3, #7a8a75)',
  },
];

export default function Journal() {
  const addToast = useToastStore((s) => s.add);

  return (
    <div className="page">
      <SEO title="Journal" description="Thoughts on slow fashion, styling guides, and the stories behind what we create." />
      <div className="page-inner">
        <div className="page-header">
          <span className="section-eyebrow">Stories & Style</span>
          <h1 className="section-title">The <em>Journal</em></h1>
          <div className="section-rule" />
          <p className="collections-subtitle">
            Thoughts on slow fashion, styling guides, and the stories behind what we create.
          </p>
        </div>

        <div className="journal-grid">
          {POSTS.map((post, i) => (
            <article
              key={post.id}
              className={`journal-card ${i === 0 ? 'journal-featured' : ''}`}
              onClick={() => addToast('Full article coming soon', 'info')}
              style={{ cursor: 'pointer' }}
            >
              <div className="journal-card-image" style={{ background: post.gradient }} />
              <div className="journal-card-body">
                <div className="journal-meta">
                  <span className="journal-category">{post.category}</span>
                  <span className="journal-date">{post.date}</span>
                </div>
                <h2 className="journal-title">{post.title}</h2>
                <p className="journal-excerpt">{post.excerpt}</p>
                <span className="journal-read-more">Read More &rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
