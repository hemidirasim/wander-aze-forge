import pool from '../config/database';

async function updateToursTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating tours table with new columns...');

    // Add new columns to tours table if they don't exist
    const columns = [
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS highlights JSONB',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS includes JSONB', 
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS excludes JSONB',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS itinerary TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS requirements TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS special_fields JSONB'
    ];

    for (const column of columns) {
      await client.query(column);
      console.log(`✅ Added column: ${column.split(' ')[5]}`);
    }

    console.log('✅ Tours table updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating tours table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the update
updateToursTable()
  .then(() => {
    console.log('🎉 Database update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database update failed:', error);
    process.exit(1);
  });
