import { User } from '../models/user.model';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';

const resetAdminUsers = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for admin reset');

    // Delete all existing admin users
    const deleteResult = await User.deleteMany({ role: 'admin' });
    logger.info(`Deleted ${deleteResult.deletedCount} admin users`);
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin users`);

    // Create new admin user with correct password hashing
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@locatelanka.com',
      password: 'Admin@123456', // This will be hashed by the User model
      role: 'admin' as const,
      isActive: true
    };

    const adminUser = new User(adminData);
    await adminUser.save();

    logger.info('✅ New admin user created successfully:', {
      id: adminUser._id,
      email: adminUser.email,
      name: `${adminUser.firstName} ${adminUser.lastName}`,
      role: adminUser.role
    });

    console.log('\n🎉 Admin User Reset Successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('⚠️  Please change the password after first login\n');

  } catch (error) {
    logger.error('❌ Error resetting admin users:', error);
    console.error('Failed to reset admin users:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await resetAdminUsers();
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

export { resetAdminUsers };
