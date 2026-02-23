import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Product } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchProducts(query.trim());
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function searchProducts(term: string) {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .ilike('name', `%${term}%`)
      .limit(8);
    setResults(data || []);
    setLoading(false);
  }

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onClose();
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              }
            }}
          />
          <button className="search-close" onClick={onClose}>&times;</button>
        </div>

        {loading && <p className="search-status">Searching...</p>}

        {!loading && query.trim() && results.length === 0 && (
          <p className="search-status">No products found for "{query}"</p>
        )}

        {results.length > 0 && (
          <div className="search-results">
            {results.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.slug}`}
                className="search-result-item"
                onClick={onClose}
              >
                <div className="search-result-image">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <div className="search-result-placeholder" />
                  )}
                </div>
                <div className="search-result-info">
                  <span className="search-result-cat">{p.category?.name}</span>
                  <h4 className="search-result-name">{p.name}</h4>
                  <span className="search-result-price">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
            <Link
              to={`/search?q=${encodeURIComponent(query.trim())}`}
              className="search-view-all"
              onClick={onClose}
            >
              View all results &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
