import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmail('');
    }
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
        />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}
