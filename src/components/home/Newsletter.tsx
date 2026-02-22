import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useToastStore } from '../../store/toastStore';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.add);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!isSupabaseConfigured) {
      addToast('Newsletter signup requires database connection', 'error');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.trim().toLowerCase() }, { onConflict: 'email' });

    if (error) {
      addToast('Something went wrong. Please try again.', 'error');
    } else {
      addToast('Welcome to The Edit! You\'ll hear from us soon.');
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <section className="newsletter">
      <h2>Join <em>the edit</em></h2>
      <p>Be first to know about new arrivals, exclusive offers &amp; styling notes from Aira.</p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </section>
  );
}
