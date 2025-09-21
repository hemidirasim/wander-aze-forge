import { testConnection, initializeDatabase } from '../config/database';

const init = async () => {
  console.log('🚀 Initializing database connection...');
  
  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }

  // Initialize tables
  console.log('📋 Creating database tables...');
  const isInitialized = await initializeDatabase();
  if (!isInitialized) {
    console.error('❌ Failed to initialize database tables');
    process.exit(1);
  }

  console.log('✅ Database initialization completed successfully!');
  process.exit(0);
};

init().catch((error) => {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
});

