import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
};

export default function SEO({ title, description, canonical, image, noindex }: SEOProps) {
  const siteName = 'Outtour Azerbaijan';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Remove any static OG/Twitter tags that may exist in index.html so Helmet tags take effect on SPA navigation
  useEffect(() => {
    const staleOg = Array.from(document.querySelectorAll('meta[property^="og:"]'));
    const staleTw = Array.from(document.querySelectorAll('meta[name^="twitter:"]'));
    [...staleOg, ...staleTw].forEach((el) => {
      if (!(el as HTMLElement).getAttribute('data-rh')) {
        el.parentElement?.removeChild(el);
      }
    });
  }, []);

  return (
    <Helmet>
      {title && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {/* Open Graph */}
      {title && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={siteName} />
      {image && <meta property="og:image" content={image} />} 
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={fullTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />} 
    </Helmet>
  );
}

