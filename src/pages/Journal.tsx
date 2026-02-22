import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useToastStore } from '../store/toastStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { JournalPost } from '../types';

const FALLBACK_POSTS = [
  {
    id: '1',
    title: 'The Art of Slow Fashion',
    excerpt: 'Why choosing fewer, better pieces transforms not just your wardrobe but your relationship with what you wear.',
    category: 'Philosophy',
    slug: 'the-art-of-slow-fashion',
    cover_image_url: null as string | null,
    is_published: true,
    published_at: '2026-02-15',
    created_at: '2026-02-15',
    body: null as string | null,
  },
  {
    id: '2',
    title: 'Five Pieces, Endless Possibilities',
    excerpt: 'A capsule wardrobe guide using our latest collection — from morning meetings to evening gatherings.',
    category: 'Style Guide',
    slug: 'five-pieces-endless-possibilities',
    cover_image_url: null,
    is_published: true,
    published_at: '2026-02-08',
    created_at: '2026-02-08',
    body: null,
  },
  {
    id: '3',
    title: 'Behind the Fabric: Our Material Story',
    excerpt: 'An inside look at the mills and makers who craft the textiles that become your favourite garments.',
    category: 'Behind the Scenes',
    slug: 'behind-the-fabric',
    cover_image_url: null,
    is_published: true,
    published_at: '2026-01-28',
    created_at: '2026-01-28',
    body: null,
  },
  {
    id: '4',
    title: 'Dressing with Intention',
    excerpt: 'How mindful dressing can become a daily ritual that centres you before the world rushes in.',
    category: 'Mindfulness',
    slug: 'dressing-with-intention',
    cover_image_url: null,
    is_published: true,
    published_at: '2026-01-15',
    created_at: '2026-01-15',
    body: null,
  },
  {
    id: '5',
    title: 'The Colour Palette of the Season',
    excerpt: 'Earth tones, sage greens, and muted golds — the hues we are drawn to this season and how to wear them.',
    category: 'Trends',
    slug: 'colour-palette-of-the-season',
    cover_image_url: null,
    is_published: true,
    published_at: '2026-01-05',
    created_at: '2026-01-05',
    body: null,
  },
  {
    id: '6',
    title: 'Care Guide: Making Your Pieces Last',
    excerpt: 'Simple care rituals to keep your garments looking beautiful for years — from washing to storage.',
    category: 'Care',
    slug: 'care-guide',
    cover_image_url: null,
    is_published: true,
    published_at: '2025-12-20',
    created_at: '2025-12-20',
    body: null,
  },
];

const GRADIENTS = [
  'linear-gradient(160deg, #8a9c85, #5a6b56)',
  'linear-gradient(160deg, #b5a090, #8a7060)',
  'linear-gradient(160deg, #9aaa95, #6a7c65)',
  'linear-gradient(160deg, #c5b5a5, #9a8a7a)',
  'linear-gradient(160deg, #7a8c75, #4a5c46)',
  'linear-gradient(160deg, #a8b8a3, #7a8a75)',
];

export default function Journal() {
  const addToast = useToastStore((s) => s.add);
  const [posts, setPosts] = useState<JournalPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (data && data.length > 0) {
        setPosts(data);
      }
    })();
  }, []);

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
          {posts.map((post, i) => (
            <article
              key={post.id}
              className={`journal-card ${i === 0 ? 'journal-featured' : ''}`}
              onClick={() => addToast('Full article coming soon', 'info')}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="journal-card-image"
                style={
                  post.cover_image_url
                    ? { backgroundImage: `url(${post.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: GRADIENTS[i % GRADIENTS.length] }
                }
              />
              <div className="journal-card-body">
                <div className="journal-meta">
                  <span className="journal-category">{post.category || 'General'}</span>
                  <span className="journal-date">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
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
