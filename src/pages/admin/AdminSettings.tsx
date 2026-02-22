import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

interface Section {
  title: string;
  fields: { key: string; label: string; multiline?: boolean }[];
}

const SECTIONS: Section[] = [
  {
    title: 'Hero Section',
    fields: [
      { key: 'hero_eyebrow', label: 'Eyebrow Text' },
      { key: 'hero_tagline', label: 'Tagline' },
      { key: 'hero_cta_primary_text', label: 'Primary CTA Text' },
      { key: 'hero_cta_primary_link', label: 'Primary CTA Link' },
      { key: 'hero_cta_secondary_text', label: 'Secondary CTA Text' },
      { key: 'hero_cta_secondary_link', label: 'Secondary CTA Link' },
    ],
  },
  {
    title: 'Marquee Strip',
    fields: [
      { key: 'marquee_messages', label: 'Messages (comma-separated)', multiline: true },
    ],
  },
  {
    title: 'Brand Story',
    fields: [
      { key: 'brand_story_eyebrow', label: 'Eyebrow' },
      { key: 'brand_story_heading', label: 'Heading' },
      { key: 'brand_story_paragraph_1', label: 'Paragraph 1', multiline: true },
      { key: 'brand_story_paragraph_2', label: 'Paragraph 2', multiline: true },
      { key: 'brand_story_cta_text', label: 'CTA Text' },
      { key: 'brand_story_cta_link', label: 'CTA Link' },
    ],
  },
];

export default function AdminSettings() {
  const siteSettings = useAdminStore((s) => s.siteSettings);
  const settingsLoading = useAdminStore((s) => s.settingsLoading);
  const fetchSettings = useAdminStore((s) => s.fetchSettings);
  const updateSettings = useAdminStore((s) => s.updateSettings);

  const [local, setLocal] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setLocal(siteSettings);
  }, [siteSettings]);

  const handleChange = (key: string, value: string) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSection = async (section: Section) => {
    setSaving(section.title);
    const settings = section.fields.map((f) => ({
      key: f.key,
      value: local[f.key] || '',
    }));
    await updateSettings(settings);
    setSaving(null);
  };

  if (settingsLoading) {
    return <p className="admin-page-loading">Loading settings...</p>;
  }

  return (
    <div>
      <div className="admin-page-top">
        <h1 className="admin-page-title">Site Settings</h1>
        <button className="admin-btn admin-btn-ghost" onClick={fetchSettings}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="admin-card-title">{section.title}</h2>
          {section.fields.map((field) => (
            <div key={field.key} className="admin-form-group">
              <label className="admin-form-label">{field.label}</label>
              {field.multiline ? (
                <textarea
                  className="admin-form-input admin-textarea"
                  rows={3}
                  value={local[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : (
                <input
                  className="admin-form-input"
                  value={local[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="admin-form-actions">
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => handleSaveSection(section)}
              disabled={saving === section.title}
            >
              <Save size={14} /> {saving === section.title ? 'Saving...' : `Save ${section.title}`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
