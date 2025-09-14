import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';

const checkAdminUsers = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for admin verification');

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' }).select('+password');
    
    console.log('\n🔍 Admin Users Found:');
    console.log('='.repeat(50));
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in the database');
      return;
    }

    for (const admin of adminUsers) {
      console.log(`\n👤 Admin User:`);
      console.log(`   ID: ${admin._id}`);
      console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log(`   Last Login: ${admin.lastLogin || 'Never'}`);
      
      // Test password verification with known passwords
      const testPasswords = [
        'Admin@123456',
        'SuperAdmin@123456', 
        'SysAdmin@123456',
        'Manager@123456'
      ];
      
      let passwordFound = false;
      for (const testPassword of testPasswords) {
        try {
          const isValid = await bcrypt.compare(testPassword, admin.password);
          if (isValid) {
            console.log(`   🔑 Password: ${testPassword} ✅`);
            passwordFound = true;
            break;
          }
        } catch (error) {
          console.log(`   ❌ Error testing password: ${error}`);
        }
      }
      
      if (!passwordFound) {
        console.log(`   🔑 Password: Unknown (not matching default passwords)`);
      }
    }

    console.log('\n📋 Summary:');
    console.log(`   Total Admin Users: ${adminUsers.length}`);
    console.log(`   Active Admins: ${adminUsers.filter(u => u.isActive).length}`);
    console.log(`   Inactive Admins: ${adminUsers.filter(u => !u.isActive).length}`);

    // Test login for the first active admin
    const activeAdmin = adminUsers.find(u => u.isActive);
    if (activeAdmin) {
      console.log('\n🧪 Testing Login Process:');
      console.log(`   Testing with: ${activeAdmin.email}`);
      
      // Test with known password
      const testPassword = 'Admin@123456';
      try {
        const isPasswordValid = await bcrypt.compare(testPassword, activeAdmin.password);
        console.log(`   Password Check: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
        
        if (isPasswordValid) {
          console.log('\n✅ Login should work with these credentials:');
          console.log(`   Email: ${activeAdmin.email}`);
          console.log(`   Password: ${testPassword}`);
        }
      } catch (error) {
        console.log(`   ❌ Password verification error: ${error}`);
      }
    }

  } catch (error) {
    logger.error('❌ Error checking admin users:', error);
    console.error('Failed to check admin users:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await checkAdminUsers();
    process.exit(0);
  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

export { checkAdminUsers };
