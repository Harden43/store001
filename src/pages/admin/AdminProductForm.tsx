import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Plus, Upload } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { adminApi } from '../../lib/adminApi';
import { supabase } from '../../lib/supabase';
import type { ProductColor, Category } from '../../types';

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  compare_price: null as number | null,
  category_id: '',
  images: [''],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: [{ name: '', hex: '#7a8c75' }] as ProductColor[],
  stock_quantity: 0,
  is_featured: false,
  is_active: true,
  tags: '',
  care_instructions: '',
  material: '',
};

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createProduct, updateProduct } = useAdminStore();

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!id;

  // Load categories via admin API
  useEffect(() => {
    adminApi<{ data: Category[] }>('categories').then(({ data }) => {
      setCategories(data);
    }).catch(() => {});
  }, []);

  // Load product for editing via admin API (handles inactive products too)
  useEffect(() => {
    if (!id) return;
    adminApi<{ data: Record<string, unknown> }>('product', { id }).then(({ data }) => {
      if (data) {
        setForm({
          name: data.name as string,
          slug: data.slug as string,
          description: (data.description as string) || '',
          price: data.price as number,
          compare_price: data.compare_price as number | null,
          category_id: data.category_id as string,
          images: (data.images as string[]).length > 0 ? data.images as string[] : [''],
          sizes: data.sizes as string[],
          colors: (data.colors as ProductColor[]).length > 0 ? data.colors as ProductColor[] : [{ name: '', hex: '#7a8c75' }],
          stock_quantity: data.stock_quantity as number,
          is_featured: data.is_featured as boolean,
          is_active: data.is_active as boolean,
          tags: ((data.tags as string[]) || []).join(', '),
          care_instructions: (data.care_instructions as string) || '',
          material: (data.material as string) || '',
        });
      }
    }).catch(() => {});
  }, [id]);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const set = (field: string, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === 'name' && !isEdit) {
      setForm((f) => ({ ...f, slug: generateSlug(value as string) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      category_id: form.category_id || null,
      images: form.images.filter(Boolean),
      sizes: form.sizes.filter(Boolean),
      colors: form.colors.filter((c) => c.name && c.hex),
      stock_quantity: Number(form.stock_quantity),
      is_featured: form.is_featured,
      is_active: form.is_active,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      care_instructions: form.care_instructions || null,
      material: form.material || null,
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // Array helpers
  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const updateImage = (i: number, val: string) => setForm((f) => ({ ...f, images: f.images.map((img, idx) => idx === i ? val : img) }));

  const addColor = () => setForm((f) => ({ ...f, colors: [...f.colors, { name: '', hex: '#7a8c75' }] }));
  const removeColor = (i: number) => setForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }));
  const updateColor = (i: number, field: keyof ProductColor, val: string) =>
    setForm((f) => ({ ...f, colors: f.colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c) }));

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `products/${fileName}`;

      try {
        // Get signed upload URL from admin API (uses service role key)
        const { token, path: uploadPath } = await adminApi<{
          signedUrl: string;
          token: string;
          path: string;
        }>('get-upload-url', { data: { path } });

        // Upload using the signed URL token (bypasses storage RLS)
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .uploadToSignedUrl(uploadPath, token, file);

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(path);

        if (urlData?.publicUrl) {
          setForm((f) => ({
            ...f,
            images: [...f.images.filter(Boolean), urlData.publicUrl],
          }));
        }
      } catch (err) {
        setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    setUploading(false);
  };

  return (
    <div>
      <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Name & Slug */}
        <div className="admin-form-row">
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Name *</label>
            <input className="admin-form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Slug</label>
            <input className="admin-form-input" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </div>
        </div>

        {/* Description */}
        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea className="admin-form-textarea" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        {/* Price, Compare, Category */}
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Price *</label>
            <input className="admin-form-input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Compare Price</label>
            <input className="admin-form-input" type="number" step="0.01" min="0" value={form.compare_price ?? ''} onChange={(e) => set('compare_price', e.target.value || null)} />
          </div>
          <div className="admin-form-group admin-form-grow">
            <label className="admin-form-label">Category</label>
            <select className="admin-form-select" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Stock Quantity *</label>
            <input className="admin-form-input" type="number" min="0" value={form.stock_quantity} onChange={(e) => set('stock_quantity', e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Material</label>
            <input className="admin-form-input" value={form.material} onChange={(e) => set('material', e.target.value)} />
          </div>
        </div>

        {/* Images */}
        <div className="admin-form-group">
          <label className="admin-form-label">Images</label>

          {/* Upload area */}
          <div
            className="admin-upload-zone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
            onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragover'); handleFileUpload(e.dataTransfer.files); }}
          >
            <Upload size={20} />
            <span>{uploading ? 'Uploading...' : 'Drop images here or click to upload'}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>

          {/* URL inputs */}
          {form.images.map((img, i) => (
            <div key={i} className="admin-form-array-item">
              <input className="admin-form-input" placeholder="https://..." value={img} onChange={(e) => updateImage(i, e.target.value)} />
              {img && <img src={img} alt="" className="admin-img-preview" />}
              {form.images.length > 1 && (
                <button type="button" className="admin-btn-icon danger" onClick={() => removeImage(i)}><X size={14} /></button>
              )}
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn-sm" onClick={addImage}>
            <Plus size={14} /> Add URL
          </button>
        </div>

        {/* Sizes */}
        <div className="admin-form-group">
          <label className="admin-form-label">Sizes</label>
          <div className="admin-size-toggles">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <button
                key={s}
                type="button"
                className={`admin-size-btn ${form.sizes.includes(s) ? 'active' : ''}`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="admin-form-group">
          <label className="admin-form-label">Colors</label>
          {form.colors.map((c, i) => (
            <div key={i} className="admin-form-array-item">
              <input className="admin-form-input" placeholder="Color name" value={c.name} onChange={(e) => updateColor(i, 'name', e.target.value)} />
              <input type="color" className="admin-color-input" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} />
              {form.colors.length > 1 && (
                <button type="button" className="admin-btn-icon danger" onClick={() => removeColor(i)}><X size={14} /></button>
              )}
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn-sm" onClick={addColor}>
            <Plus size={14} /> Add Color
          </button>
        </div>

        {/* Tags */}
        <div className="admin-form-group">
          <label className="admin-form-label">Tags (comma-separated)</label>
          <input className="admin-form-input" placeholder="new, bestseller, silk" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>

        {/* Care Instructions */}
        <div className="admin-form-group">
          <label className="admin-form-label">Care Instructions</label>
          <input className="admin-form-input" value={form.care_instructions} onChange={(e) => set('care_instructions', e.target.value)} />
        </div>

        {/* Toggles */}
        <div className="admin-form-row">
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} />
            <span>Active</span>
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
            <span>Featured</span>
          </label>
        </div>

        {/* Submit */}
        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/products')}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
