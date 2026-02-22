import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const APP_NAME = 'The Aira Edit';
const DEFAULT_DESC = 'A thoughtfully curated clothing brand for the modern woman. Pieces chosen with intention, worn with grace.';

export default function SEO({ title, description, image }: Props) {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  const desc = description || DEFAULT_DESC;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
