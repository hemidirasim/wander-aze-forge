import { initializeDatabase } from '../config/database';
import { DatabaseAdminService } from '../services/databaseAdminService';

async function listAdminUsers() {
  try {
    console.log('📋 Veritabanındaki admin kullanıcıları listeleniyor...');
    
    // Initialize database first
    await initializeDatabase();
    console.log('✅ Veritabanı bağlantısı kuruldu\n');

    // Get all admin users
    const users = await DatabaseAdminService.getAllAdminUsers();

    if (users.length === 0) {
      console.log('❌ Hiç admin kullanıcı bulunamadı!');
      return;
    }

    console.log(`🎯 Toplam ${users.length} admin kullanıcı bulundu:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. 👤 ${user.full_name || user.username}`);
      console.log(`   ├─ ID: ${user.id}`);
      console.log(`   ├─ Username: ${user.username}`);
      console.log(`   ├─ Email: ${user.email || 'Belirtilmemiş'}`);
      console.log(`   ├─ Durum: ${user.is_active ? '✅ Aktif' : '❌ Pasif'}`);
      console.log(`   ├─ İzinler: ${user.permissions.length} adet`);
      console.log(`   ├─ Son Giriş: ${user.last_login || 'Hiç giriş yapmamış'}`);
      console.log(`   └─ Oluşturulma: ${new Date(user.created_at).toLocaleDateString('tr-TR')}`);
      console.log('');
    });

    console.log('🔑 Giriş Bilgileri:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} / ${user.username}123`);
    });

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

// Run the script
listAdminUsers();
