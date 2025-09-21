import { Pool } from 'pg';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_cuU7z3plExsy@ep-winter-shadow-ad30554v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function listBlogPosts() {
  try {
    console.log('📝 Blog posts listeleniyor...');
    
    const client = await pool.connect();
    
    try {
      const result = await client.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
      
      console.log(`\n🎯 Toplam ${result.rows.length} blog post bulundu:\n`);
      
      result.rows.forEach((post, index) => {
        console.log(`${index + 1}. 📄 ${post.title}`);
        console.log(`   ├─ ID: ${post.id}`);
        console.log(`   ├─ Author: ${post.author}`);
        console.log(`   ├─ Category: ${post.category || 'N/A'}`);
        console.log(`   ├─ Featured: ${post.featured ? '✅' : '❌'}`);
        console.log(`   ├─ Status: ${post.status}`);
        console.log(`   ├─ Featured Image: ${post.featured_image || 'N/A'}`);
        console.log(`   ├─ Content Length: ${post.content ? post.content.length : 0} characters`);
        console.log(`   └─ Created: ${new Date(post.created_at).toLocaleDateString('tr-TR')}`);
        console.log('');
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Blog posts listelenirken hata oluştu:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

listBlogPosts();
