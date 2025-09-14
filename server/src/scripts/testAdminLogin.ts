import axios from 'axios';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';

const testAdminLogin = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for login test');

    const serverUrl = process.env['SERVER_URL'] || 'http://localhost:5000';
    
    console.log('\n🧪 Testing Admin Login API');
    console.log('='.repeat(40));
    console.log(`Server URL: ${serverUrl}`);

    // Test admin login
    const loginData = {
      email: 'admin@locatelanka.com',
      password: 'Admin@123456'
    };

    console.log('\n📤 Sending login request...');
    console.log(`Email: ${loginData.email}`);
    console.log(`Password: ${loginData.password}`);

    try {
      const response = await axios.post(`${serverUrl}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('\n✅ Login Response:');
      console.log(`Status: ${response.status}`);
      console.log(`Success: ${response.data.success}`);
      
      if (response.data.success) {
        console.log(`User ID: ${response.data.user._id}`);
        console.log(`User Name: ${response.data.user.firstName} ${response.data.user.lastName}`);
        console.log(`User Email: ${response.data.user.email}`);
        console.log(`User Role: ${response.data.user.role}`);
        console.log(`Access Token: ${response.data.accessToken ? 'Provided' : 'Missing'}`);
        
        if (response.data.user.role === 'admin') {
          console.log('\n🎉 Admin login successful! You can now access the admin dashboard.');
        } else {
          console.log('\n⚠️  User logged in but is not an admin.');
        }
      }

    } catch (error: any) {
      console.log('\n❌ Login Failed:');
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
        
        if (error.response.status === 401) {
          console.log('\n🔍 Possible Issues:');
          console.log('1. Incorrect email or password');
          console.log('2. User account is deactivated');
          console.log('3. Password hashing mismatch');
        }
      } else {
        console.log(`Network Error: ${error.message}`);
        console.log('\n🔍 Possible Issues:');
        console.log('1. Server is not running');
        console.log('2. Wrong server URL');
        console.log('3. Network connectivity issues');
      }
    }

    // Test health endpoint
    console.log('\n🏥 Testing Server Health...');
    try {
      const healthResponse = await axios.get(`${serverUrl}/health`);
      console.log(`Health Status: ${healthResponse.status} - ${healthResponse.data.status}`);
    } catch (error: any) {
      console.log(`Health Check Failed: ${error.message}`);
    }

  } catch (error) {
    logger.error('❌ Error testing admin login:', error);
    console.error('Failed to test admin login:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await testAdminLogin();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

export { testAdminLogin };
