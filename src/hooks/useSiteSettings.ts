import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULTS: Record<string, string> = {
  hero_eyebrow: 'New Season Arrivals — Spring 2026',
  hero_tagline: 'Curated pieces for the woman who moves with intention',
  hero_cta_primary_text: 'Shop the Edit',
  hero_cta_primary_link: '/shop',
  hero_cta_secondary_text: 'View Lookbook',
  hero_cta_secondary_link: '/lookbook',
  marquee_messages: 'New Arrivals,Free Shipping Over $150,Spring Collection 2026,Curated with Care,Ethically Sourced',
  brand_story_eyebrow: 'Our Philosophy',
  brand_story_heading: 'Dressed with purpose, worn with grace',
  brand_story_paragraph_1: 'The Aira Edit is a curation of thoughtfully designed pieces that celebrate femininity in its quietest, most powerful form. Each garment is chosen for its quality, its story, and the way it moves with the women who wear it.',
  brand_story_paragraph_2: 'We believe clothing is more than fabric — it\'s a language. One that speaks before you do.',
  brand_story_cta_text: 'Our Story',
  brand_story_cta_link: '/about',
  shipping_threshold: '150',
  shipping_flat_rate: '9.95',
  social_instagram: 'https://instagram.com/theairaedit',
  social_pinterest: 'https://pinterest.com/theairaedit',
  social_tiktok: 'https://tiktok.com/@theairaedit',
  contact_email: 'hello@theairaedit.com',
  contact_phone: '',
  contact_address: '',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value');

      if (data && data.length > 0) {
        const map: Record<string, string> = { ...DEFAULTS };
        for (const row of data) {
          map[row.key] = row.value;
        }
        setSettings(map);
      }
    })();
  }, []);

  const get = (key: string) => settings[key] || DEFAULTS[key] || '';

  return { settings, get };
}
