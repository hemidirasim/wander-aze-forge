import { Pool } from 'pg';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_cuU7z3plExsy@ep-winter-shadow-ad30554v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function updateBlogPostsTable() {
  try {
    console.log('🔧 Blog posts tablosu güncelleniyor...');
    
    const client = await pool.connect();
    
    try {
      // Add new columns if they don't exist
      const columns = [
        'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category VARCHAR(100)',
        'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[]',
        'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT',
        'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'published\'',
        'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false'
      ];
      
      for (const column of columns) {
        await client.query(column);
        console.log(`✅ Column added: ${column.split(' ')[5]}`);
      }
      
      console.log('\n🎉 Blog posts tablosu başarıyla güncellendi!');
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Blog posts tablosu güncellenirken hata oluştu:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

updateBlogPostsTable();
