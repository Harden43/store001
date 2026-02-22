import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { adminApi } from '../../lib/adminApi';
import type { JournalPost } from '../../types';

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image_url: string;
  is_published: boolean;
}

const EMPTY: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: '',
  cover_image_url: '',
  is_published: false,
};

export default function AdminJournalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const createJournalPost = useAdminStore((s) => s.createJournalPost);
  const updateJournalPost = useAdminStore((s) => s.updateJournalPost);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setFetching(true);
      try {
        const res = await adminApi<{ data: JournalPost }>('journal-post', { id });
        const p = res.data;
        setForm({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || '',
          body: p.body || '',
          category: p.category || '',
          cover_image_url: p.cover_image_url || '',
          is_published: p.is_published,
        });
      } catch {
        navigate('/admin/journal');
      }
      setFetching(false);
    })();
  }, [id, navigate]);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      excerpt: form.excerpt || null,
      body: form.body || null,
      category: form.category || null,
      cover_image_url: form.cover_image_url || null,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    if (id) {
      await updateJournalPost(id, payload);
    } else {
      await createJournalPost(payload);
    }
    setLoading(false);
    navigate('/admin/journal');
  };

  if (fetching) {
    return <p className="admin-page-loading">Loading post...</p>;
  }

  return (
    <div>
      <div className="admin-page-top">
        <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/journal')}>
          <ArrowLeft size={16} /> Back to Journal
        </button>
        <h1 className="admin-page-title">{id ? 'Edit Post' : 'New Post'}</h1>
      </div>

      <div className="admin-card">
        <div className="admin-form-row">
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Title *</label>
            <input
              className="admin-form-input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                  slug: id ? f.slug : generateSlug(e.target.value),
                }))
              }
            />
          </div>
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Slug</label>
            <input
              className="admin-form-input"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Category</label>
            <input
              className="admin-form-input"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Style Guide, Philosophy"
            />
          </div>
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Cover Image URL</label>
            <input
              className="admin-form-input"
              value={form.cover_image_url}
              onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Excerpt</label>
          <textarea
            className="admin-form-input admin-textarea"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="Short description shown on the journal listing..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Body</label>
          <textarea
            className="admin-form-input admin-textarea"
            rows={12}
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Full article content..."
          />
        </div>

        <div className="admin-form-row" style={{ alignItems: 'center' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Published</label>
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              />
              <span className="admin-toggle-slider" />
            </label>
          </div>
          {form.cover_image_url && (
            <div className="admin-form-group">
              <label className="admin-form-label">Preview</label>
              <img src={form.cover_image_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/journal')}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={!form.title || loading}>
            <Save size={14} /> {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
