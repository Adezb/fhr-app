import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_TITLE = 'Fundamental Rights Enforcement in Nigeria';
const DEFAULT_DESCRIPTION = 'A practice guide to fundamental rights enforcement in Nigeria. Access legal authorities and case laws offline.';
const DEFAULT_IMAGE = 'https://fhrnigeria.app/og-image.png';
const SITE_BASE_URL = 'https://fhrnigeria.app';


export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '/',
  type = 'website',
}: SEOProps) {
  const fullTitle = title
    ? `${title} | Fundamental Rights Practice Guide`
    : DEFAULT_TITLE;

  const fullUrl = url.startsWith('http')
    ? url
    : `${SITE_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

  const fullImage = image.startsWith('http')
    ? image
    : `${SITE_BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Fundamental Rights Enforcement" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:url" content={fullUrl} />
    </Helmet>
  );
}
