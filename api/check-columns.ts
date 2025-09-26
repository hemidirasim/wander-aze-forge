import { Pool } from 'pg';

export async function GET() {
  let pool: Pool | null = null;
  
  try {
    console.log('Check Columns API called');
    
    if (!process.env.DATABASE_URL) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Database connection not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    // Get column information for tours table
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'tours' 
      ORDER BY ordinal_position
    `);
    
    console.log('Tours table columns:', result.rows);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Database connection successful',
      columns: result.rows,
      columnCount: result.rows.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in check columns API:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    if (pool) {
      try {
        await pool.end();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
