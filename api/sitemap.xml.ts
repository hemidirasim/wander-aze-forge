import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const baseUrl = process.env.PUBLIC_BASE_URL || 'https://outtour.az';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Fetch categories
    const categoriesResult = await pool.query(`
      SELECT slug, updated_at FROM tour_categories WHERE is_active = true ORDER BY sort_order ASC
    `);
    // Fetch tours
    const toursResult = await pool.query(`
      SELECT id, slug, title, category, updated_at FROM tours WHERE is_active = true ORDER BY updated_at DESC
    `);

    const urls: string[] = [];
    const now = new Date().toISOString();

    // Static URLs
    const staticUrls = [
      '',
      'tours',
      'about',
      'blog',
      'projects',
      'contact'
    ];
    staticUrls.forEach(path => urls.push(`<url><loc>${baseUrl}/${path}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`));

    // Categories
    categoriesResult.rows.forEach((cat: any) => {
      urls.push(`<url><loc>${baseUrl}/tours/${cat.slug}</loc><lastmod>${new Date(cat.updated_at || now).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
    });

    // Tours
    toursResult.rows.forEach((tour: any) => {
      const slug = tour.slug || String(tour.title).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
      urls.push(`<url><loc>${baseUrl}/tours/${tour.category}/${slug}?id=${tour.id}</loc><lastmod>${new Date(tour.updated_at || now).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (e: any) {
    console.error('Sitemap error:', e);
    res.status(500).send('Error generating sitemap');
  }
}


