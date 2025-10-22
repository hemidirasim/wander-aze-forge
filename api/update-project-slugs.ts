import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};
const pool = new Pool(dbConfig);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const client = await pool.connect();

    // First, add slug column if it doesn't exist
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE
    `);

    // Get all projects without slugs
    const projectsResult = await client.query(`
      SELECT id, title FROM projects WHERE slug IS NULL OR slug = ''
    `);
    
    console.log(`Found ${projectsResult.rows.length} projects without slugs`);
    
    for (const project of projectsResult.rows) {
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      try {
        const updateSlugQuery = 'UPDATE projects SET slug = $1 WHERE id = $2';
        await client.query(updateSlugQuery, [slug, project.id]);
        console.log(`Updated project ${project.id}: ${project.title} -> ${slug}`);
      } catch (error) {
        console.error(`Error updating project ${project.id}:`, error);
        // If slug already exists, add a number suffix
        let counter = 1;
        let uniqueSlug = `${slug}-${counter}`;
        
        while (true) {
          try {
            await client.query(updateSlugQuery, [uniqueSlug, project.id]);
            console.log(`Updated project ${project.id} with unique slug: ${uniqueSlug}`);
            break;
          } catch (e) {
            counter++;
            uniqueSlug = `${slug}-${counter}`;
          }
        }
      }
    }
    
    console.log('Generated slugs for all projects.');

    client.release();
    return res.status(200).json({ 
      success: true, 
      message: 'Project slugs updated successfully',
      updated: projectsResult.rows.length
    });

  } catch (error) {
    console.error('Database migration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database migration failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
