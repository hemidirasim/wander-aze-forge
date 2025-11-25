import React, { PropsWithChildren, useEffect } from 'react';

const DEFAULT_FAVICON = '/favicon.ico';

const updateLinkTag = (rel: string, href: string) => {
  if (typeof document === 'undefined') return;

  // Try multiple selectors for different rel values
  const selectors = [
    `link[rel="${rel}"]`,
    `link[rel='${rel}']`,
    `link[rel="${rel}"]`,
  ];
  
  let link: HTMLLinkElement | null = null;
  for (const selector of selectors) {
    link = document.querySelector<HTMLLinkElement>(selector);
    if (link) break;
  }

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
    console.log(`Created new favicon link tag with rel="${rel}"`);
  }

  // Add timestamp to bypass browser cache
  const separator = href.includes('?') ? '&' : '?';
  const cacheBuster = `_t=${Date.now()}`;
  const newHref = `${href}${separator}${cacheBuster}`;
  
  if (link.href !== newHref) {
    link.href = newHref;
    console.log(`Updated favicon link (rel="${rel}") to:`, newHref);
    
    // Force reload by removing and re-adding
    const parent = link.parentNode;
    if (parent) {
      const nextSibling = link.nextSibling;
      parent.removeChild(link);
      if (nextSibling) {
        parent.insertBefore(link, nextSibling);
      } else {
        parent.appendChild(link);
      }
    }
  }
};

const SiteBrandingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    let isMounted = true;

    const applyBranding = (faviconUrl?: string, appleUrl?: string) => {
      if (!isMounted || typeof document === 'undefined') return;
      
      // Use admin-set favicon if available, otherwise fallback to default
      const favicon = faviconUrl && faviconUrl.trim() ? faviconUrl.trim() : DEFAULT_FAVICON;
      const appleIcon = appleUrl && appleUrl.trim() ? appleUrl.trim() : favicon;

      console.log('Applying branding:', { favicon, appleIcon });
      
      updateLinkTag('icon', favicon);
      updateLinkTag('shortcut icon', favicon);
      updateLinkTag('apple-touch-icon', appleIcon);
    };

    const fetchBranding = async () => {
      if (typeof window === 'undefined') return;

      try {
        console.log('Fetching site branding from /api/site-branding...');
        const response = await fetch('/api/site-branding', {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load branding. Status: ${response.status}`);
        }

        const payload = await response.json();
        console.log('Site branding API response:', payload);

        if (payload?.success && payload.data && payload.data.favicon_url) {
          console.log('✅ Applying favicon from admin panel:', payload.data.favicon_url);
          applyBranding(payload.data.favicon_url, payload.data.apple_touch_icon_url);
        } else {
          console.log('⚠️ No favicon in database, using default');
          applyBranding();
        }
      } catch (error) {
        console.error('❌ Site branding fetch failed, falling back to default favicon.', error);
        applyBranding();
      }
    };

    // Fetch immediately on mount
    fetchBranding();

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
};

export default SiteBrandingProvider;


