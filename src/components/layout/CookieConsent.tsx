import { useState, useEffect } from 'react';

const STORAGE_KEY = 'aira-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>We use cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.</p>
      <button className="cookie-accept-btn" onClick={handleAccept}>Accept</button>
    </div>
  );
}
