import { User } from '../models/user.model';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';

interface AdminUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin';
  isActive: boolean;
}

const createAdminUser = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for admin seeding');

    // Admin user data
    const adminData: AdminUserData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@locatelanka.com',
      password: 'Admin@123456', // This will be hashed
      role: 'admin',
      isActive: true
    };

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      logger.info('Admin user already exists:', {
        email: existingAdmin.email,
        role: existingAdmin.role,
        isActive: existingAdmin.isActive
      });
      
      // Update existing admin if needed
      if (!existingAdmin.isActive) {
        existingAdmin.isActive = true;
        await existingAdmin.save();
        logger.info('Activated existing admin user');
      }
      
      return;
    }

    // Create new admin user (password will be hashed automatically by the User model)
    const adminUser = new User({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      password: adminData.password, // Don't hash here - let the model do it
      role: adminData.role,
      isActive: adminData.isActive
    });

    await adminUser.save();

    logger.info('✅ Admin user created successfully:', {
      id: adminUser._id,
      email: adminUser.email,
      name: `${adminUser.firstName} ${adminUser.lastName}`,
      role: adminUser.role
    });

    console.log('\n🎉 Admin User Created Successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('⚠️  Please change the password after first login\n');

  } catch (error) {
    logger.error('❌ Error creating admin user:', error);
    console.error('Failed to create admin user:', error);
    throw error;
  }
};

const createMultipleAdmins = async (admins: Omit<AdminUserData, 'role' | 'isActive'>[]): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for multiple admin seeding');

    const createdAdmins: any[] = [];

    for (const adminData of admins) {
      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: adminData.email });

      if (existingAdmin) {
        logger.info(`Admin user already exists: ${adminData.email}`);
        continue;
      }

      // Create new admin user (password will be hashed automatically by the User model)
      const adminUser = new User({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        password: adminData.password, // Don't hash here - let the model do it
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      createdAdmins.push({
        email: adminData.email,
        password: adminData.password,
        name: `${adminData.firstName} ${adminData.lastName}`
      });

      logger.info(`✅ Admin user created: ${adminData.email}`);
    }

    if (createdAdmins.length > 0) {
      console.log('\n🎉 Admin Users Created Successfully!');
      createdAdmins.forEach(admin => {
        console.log(`📧 ${admin.name}: ${admin.email} | 🔑 Password: ${admin.password}`);
      });
      console.log('⚠️  Please change passwords after first login\n');
    } else {
      console.log('\n✅ All admin users already exist\n');
    }

  } catch (error) {
    logger.error('❌ Error creating admin users:', error);
    console.error('Failed to create admin users:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'single':
        await createAdminUser();
        break;
      
      case 'multiple':
        const multipleAdmins = [
          {
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@locatelanka.com',
            password: 'SuperAdmin@123456'
          },
          {
            firstName: 'System',
            lastName: 'Administrator',
            email: 'sysadmin@locatelanka.com',
            password: 'SysAdmin@123456'
          },
          {
            firstName: 'Platform',
            lastName: 'Manager',
            email: 'manager@locatelanka.com',
            password: 'Manager@123456'
          }
        ];
        await createMultipleAdmins(multipleAdmins);
        break;
      
      case 'custom':
        // Custom admin creation with environment variables or prompts
        const customEmail = process.env['ADMIN_EMAIL'] || 'admin@locatelanka.com';
        const customPassword = process.env['ADMIN_PASSWORD'] || 'Admin@123456';
        const customFirstName = process.env['ADMIN_FIRST_NAME'] || 'Admin';
        const customLastName = process.env['ADMIN_LAST_NAME'] || 'User';

        await createMultipleAdmins([{
          firstName: customFirstName,
          lastName: customLastName,
          email: customEmail,
          password: customPassword
        }]);
        break;
      
      default:
        console.log('\n📋 Usage:');
        console.log('  npm run seed:admin single     - Create single default admin');
        console.log('  npm run seed:admin multiple   - Create multiple predefined admins');
        console.log('  npm run seed:admin custom     - Create admin from environment variables');
        console.log('\n🔧 Environment variables for custom mode:');
        console.log('  ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME\n');
        await createAdminUser(); // Default to single admin
        break;
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

export { createAdminUser, createMultipleAdmins };
