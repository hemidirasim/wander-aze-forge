import pool from '../config/database';

async function updateToursTableExtended() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Updating tours table with extended fields...');

    // Add new columns to tours table if they don't exist
    const columns = [
      // Basic info
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 4.5',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_size VARCHAR(50)',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS location VARCHAR(255)',
      
      // Overview section
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS overview TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS best_season VARCHAR(100)',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS meeting_point TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS languages VARCHAR(255)',
      
      // Accommodation and Food
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS accommodation_details TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS meals_details TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS water_snacks_details TEXT',
      
      // Equipment
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS provided_equipment TEXT[]',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS what_to_bring TEXT[]',
      
      // Transport
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS transport_details TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS pickup_service TEXT',
      
      // Media
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS gallery_images TEXT[]',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS photography_service TEXT',
      
      // Price details
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS price_includes TEXT[]',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_discounts TEXT',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS early_bird_discount TEXT',
      
      // Contact
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50)',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS booking_terms TEXT',
      
      // Status
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true',
      'ALTER TABLE tours ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false'
    ];

    for (const column of columns) {
      try {
        await client.query(column);
        const columnName = column.split(' ')[5];
        console.log(`✅ Added column: ${columnName}`);
      } catch (error) {
        console.log(`⚠️  Column might already exist: ${column.split(' ')[5]}`);
      }
    }

    console.log('✅ Tours table updated successfully with extended fields!');
    
  } catch (error) {
    console.error('❌ Error updating tours table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the update
updateToursTableExtended()
  .then(() => {
    console.log('🎉 Database update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database update failed:', error);
    process.exit(1);
  });
