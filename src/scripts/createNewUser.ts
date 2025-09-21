import { initializeDatabase } from '../config/database';
import { DatabaseAdminService } from '../services/databaseAdminService';

async function createNewUser() {
  try {
    console.log('🌱 Yeni admin kullanıcı oluşturuluyor...');
    
    // Initialize database first
    await initializeDatabase();
    console.log('✅ Veritabanı bağlantısı kuruldu');

    // Create new admin user
    const newUser = await DatabaseAdminService.createAdminUser({
      username: 'newuser',
      password: 'newuser123',
      email: 'newuser@wanderaze.com',
      full_name: 'New User',
      permissions: [
        'manage_tours',
        'manage_projects',
        'manage_programs',
        'manage_partners',
        'manage_blog',
        'view_analytics'
      ]
    });

    console.log('\n🎉 Yeni kullanıcı başarıyla oluşturuldu!');
    console.log('\n📋 Kullanıcı Bilgileri:');
    console.log('├─ ID:', newUser.id);
    console.log('├─ Username: newuser');
    console.log('├─ Password: newuser123');
    console.log('├─ Email: newuser@wanderaze.com');
    console.log('├─ Full Name: New User');
    console.log('└─ Permissions:', newUser.permissions.length, 'izin');

    console.log('\n🔑 Giriş Bilgileri:');
    console.log('Username: newuser');
    console.log('Password: newuser123');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

// Run the script
createNewUser();
