import axios from 'axios';
import { DatabaseConfig } from '../config/database.config';
import { User } from '../models/user.model';
import { ApiKey } from '../models/ApiKey.model';
import { logger } from '../config/logger.config';

const BASE_URL = process.env['SERVER_URL'] || 'http://localhost:5000';

const testApiKeyLimits = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for API key limits test');

    // Find test user
    const testUser = await User.findOne({ email: 'john.doe@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found. Please create a user first.');
      return;
    }

    console.log(`📋 Testing API key limits for user: ${testUser.email}`);
    console.log(`📦 Current plan: ${testUser.subscription?.plan || 'free'}`);

    // Clean up existing API keys for clean test
    await ApiKey.deleteMany({ userId: testUser._id });
    console.log('🧹 Cleaned up existing API keys for clean test');

    // Login to get JWT token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123'
    });

    const accessToken = loginResponse.data.accessToken;
    console.log('✅ Successfully logged in test user');

    // Set up axios with auth header
    const authApi = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('\n🧪 Testing API Key Limits:');
    console.log('===========================');

    // Test 1: Get current limits
    try {
      const limitsResponse = await authApi.get('/api/keys/usage/limits');
      console.log('\n✅ GET /api/keys/usage/limits - Success');
      console.log('Current limits:', JSON.stringify(limitsResponse.data.data, null, 2));
    } catch (error: any) {
      console.log('❌ GET /api/keys/usage/limits - Failed:', error.response?.data?.error?.message || error.message);
    }

    // Test 2: Create API keys up to the limit
    const plan = testUser.subscription?.plan || 'free';
    const expectedLimit = plan === 'free' ? 2 : plan === 'pro' ? 10 : -1;
    
    console.log(`\n🔑 Attempting to create API keys (limit: ${expectedLimit === -1 ? 'unlimited' : expectedLimit}):`);
    
    const keysToCreate = expectedLimit === -1 ? 3 : expectedLimit + 1; // Test one more than limit
    
    for (let i = 1; i <= keysToCreate; i++) {
      try {
        const createResponse = await authApi.post('/api/keys', {
          name: `Test Key ${i}`,
          description: `Test API key number ${i}`
        });
        console.log(`✅ Created API key ${i}: ${createResponse.data.data.name}`);
      } catch (error: any) {
        if (error.response?.status === 409) {
          console.log(`❌ Failed to create API key ${i}: ${error.response.data.error.message}`);
          console.log(`🎯 Limit enforcement working correctly!`);
          break;
        } else {
          console.log(`❌ Unexpected error creating API key ${i}:`, error.response?.data?.error?.message || error.message);
        }
      }
    }

    // Test 3: Check final limits
    try {
      const finalLimitsResponse = await authApi.get('/api/keys/usage/limits');
      console.log('\n📊 Final API key usage:');
      console.log(JSON.stringify(finalLimitsResponse.data.data, null, 2));
    } catch (error: any) {
      console.log('❌ Failed to get final limits:', error.response?.data?.error?.message || error.message);
    }

    console.log('\n🎉 API key limits test completed!');

  } catch (error) {
    logger.error('❌ Error testing API key limits:', error);
    console.error('Failed to test API key limits:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await testApiKeyLimits();
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

export { testApiKeyLimits };
