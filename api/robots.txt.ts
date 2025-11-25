import type { VercelRequest, VercelResponse } from '@vercel/node';

const baseUrl = process.env.PUBLIC_BASE_URL || 'https://outtour.az';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const robots = `User-agent: *
Allow: /

# Disallow utility routes
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /dashboard

# Content-signal: search=yes,ai-train=no

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(robots);
}




