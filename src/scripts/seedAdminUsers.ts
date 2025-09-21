import { initializeDatabase } from '../config/database';
import { DatabaseAdminService } from '../services/databaseAdminService';

async function seedAdminUsers() {
  try {
    console.log('🌱 Starting admin users seeding...');
    
    // Initialize database first
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Create default admin user
    const adminUser = await DatabaseAdminService.createAdminUser({
      username: 'admin',
      password: 'admin123',
      email: 'admin@wanderaze.com',
      full_name: 'System Administrator',
      permissions: [
        'manage_tours',
        'manage_projects',
        'manage_programs',
        'manage_partners',
        'manage_blog',
        'manage_bookings',
        'manage_contact',
        'manage_files',
        'view_analytics'
      ]
    });

    console.log('✅ Default admin user created:', {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      full_name: adminUser.full_name
    });

    // Create additional admin user (optional)
    const managerUser = await DatabaseAdminService.createAdminUser({
      username: 'manager',
      password: 'manager123',
      email: 'manager@wanderaze.com',
      full_name: 'Content Manager',
      permissions: [
        'manage_tours',
        'manage_projects',
        'manage_programs',
        'manage_partners',
        'manage_blog',
        'view_analytics'
      ]
    });

    console.log('✅ Manager user created:', {
      id: managerUser.id,
      username: managerUser.username,
      email: managerUser.email,
      full_name: managerUser.full_name
    });

    // Create moderator user (optional)
    const moderatorUser = await DatabaseAdminService.createAdminUser({
      username: 'moderator',
      password: 'moderator123',
      email: 'moderator@wanderaze.com',
      full_name: 'Content Moderator',
      permissions: [
        'manage_blog',
        'manage_contact',
        'view_analytics'
      ]
    });

    console.log('✅ Moderator user created:', {
      id: moderatorUser.id,
      username: moderatorUser.username,
      email: moderatorUser.email,
      full_name: moderatorUser.full_name
    });

    console.log('🎉 Admin users seeding completed successfully!');
    console.log('\n📋 Admin Users Created:');
    console.log('1. admin / admin123 (Full access)');
    console.log('2. manager / manager123 (Content management)');
    console.log('3. moderator / moderator123 (Limited access)');

  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAdminUsers();
