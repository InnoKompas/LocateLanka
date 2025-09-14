import axios from 'axios';
import { DatabaseConfig } from '../config/database.config';
import { User } from '../models/user.model';
import { logger } from '../config/logger.config';

const BASE_URL = process.env['SERVER_URL'] || 'http://localhost:5000';

const testBillingEndpoints = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for billing endpoint test');

    // Find a test user (or create one)
    let testUser = await User.findOne({ email: 'john.doe@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found. Please create a user first.');
      return;
    }

    // Simulate login to get JWT token
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123' // Assuming this is the test user's password
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

    console.log('\n🧪 Testing Billing Endpoints:');
    console.log('==============================');

    // Test 1: Get billing info
    try {
      const billingResponse = await authApi.get('/api/billing');
      console.log('\n✅ GET /api/billing - Success');
      console.log('Current Plan:', billingResponse.data.data.currentPlan);
      console.log('Amount:', `$${billingResponse.data.data.amount}/${billingResponse.data.data.currency}`);
      console.log('Usage:', `${billingResponse.data.data.usage.currentMonth}/${billingResponse.data.data.usage.limit} (${billingResponse.data.data.usage.percentage}%)`);
    } catch (error: any) {
      console.log('❌ GET /api/billing - Failed:', error.response?.data?.error?.message || error.message);
    }

    // Test 2: Get available plans
    try {
      const plansResponse = await authApi.get('/api/billing/plans');
      console.log('\n✅ GET /api/billing/plans - Success');
      console.log('Available Plans:');
      plansResponse.data.data.forEach((plan: any) => {
        console.log(`  - ${plan.name}: $${plan.price}/${plan.currency} (${plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls} API calls)`);
      });
    } catch (error: any) {
      console.log('❌ GET /api/billing/plans - Failed:', error.response?.data?.error?.message || error.message);
    }

    // Test 3: Test upgrade plan (demo)
    try {
      const upgradeResponse = await authApi.post('/api/billing/upgrade', {
        planId: 'pro'
      });
      console.log('\n✅ POST /api/billing/upgrade - Success');
      console.log('Checkout URL:', upgradeResponse.data.data.checkoutUrl);
    } catch (error: any) {
      console.log('❌ POST /api/billing/upgrade - Failed:', error.response?.data?.error?.message || error.message);
    }

    // Test 4: Get usage stats
    try {
      const usageResponse = await authApi.get('/api/billing/usage');
      console.log('\n✅ GET /api/billing/usage - Success');
      console.log('Usage Stats:', usageResponse.data.data);
    } catch (error: any) {
      console.log('❌ GET /api/billing/usage - Failed:', error.response?.data?.error?.message || error.message);
    }

    // Test 5: Get billing history
    try {
      const historyResponse = await authApi.get('/api/billing/history');
      console.log('\n✅ GET /api/billing/history - Success');
      console.log('Billing History:', historyResponse.data.data);
    } catch (error: any) {
      console.log('❌ GET /api/billing/history - Failed:', error.response?.data?.error?.message || error.message);
    }

    console.log('\n🎉 Billing endpoints test completed!');

  } catch (error) {
    logger.error('❌ Error testing billing endpoints:', error);
    console.error('Failed to test billing endpoints:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await testBillingEndpoints();
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

export { testBillingEndpoints };
