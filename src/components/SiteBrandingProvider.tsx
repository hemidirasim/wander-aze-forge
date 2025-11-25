import React, { PropsWithChildren, useEffect } from 'react';

const DEFAULT_FAVICON = '/favicon.ico';

const updateLinkTag = (rel: string, href: string) => {
  if (typeof document === 'undefined') return;

  const selector = `link[rel="${rel}"]`;
  let link = document.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.href = href;
};

const SiteBrandingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    let isMounted = true;

    const applyBranding = (faviconUrl?: string, appleUrl?: string) => {
      if (!isMounted) return;
      const fallback = faviconUrl || DEFAULT_FAVICON;

      updateLinkTag('icon', fallback);
      updateLinkTag('shortcut icon', fallback);
      updateLinkTag('apple-touch-icon', appleUrl || fallback);
    };

    const fetchBranding = async () => {
      if (typeof window === 'undefined') return;

      try {
        const response = await fetch('/api/site-branding');
        if (!response.ok) {
          throw new Error(`Failed to load branding. Status: ${response.status}`);
        }

        const payload = await response.json();

        if (payload?.success && payload.data) {
          applyBranding(payload.data.favicon_url, payload.data.apple_touch_icon_url);
        } else {
          applyBranding();
        }
      } catch (error) {
        console.warn('Site branding fetch failed, falling back to default favicon.', error);
        applyBranding();
      }
    };

    fetchBranding();

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
};

export default SiteBrandingProvider;


