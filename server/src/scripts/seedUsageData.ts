import mongoose from 'mongoose';
import { UsageLog } from '../models/UsageLog.model';
import { ApiKey } from '../models/ApiKey.model';
import { connectDB } from '../config/mongodb';

/**
 * Script to seed sample usage data for testing analytics
 */
async function seedUsageData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get all API keys to seed data for
    const apiKeys = await ApiKey.find({ isActive: true }).limit(5);
    
    if (apiKeys.length === 0) {
      console.log('No active API keys found. Please create some API keys first.');
      return;
    }

    console.log(`Found ${apiKeys.length} API keys to seed data for`);

    const endpoints = [
      '/api/v1/divisions',
      '/api/v1/districts', 
      '/api/v1/provinces',
      '/api/v1/dsds',
      '/api/v1/gn-divisions'
    ];

    const methods = ['GET', 'POST'];
    const statusCodes = [200, 201, 400, 404, 500];
    const statusWeights = [0.7, 0.15, 0.08, 0.05, 0.02]; // Most requests are successful

    // Generate usage data for the last 60 days
    const logsToCreate = [];
    const now = new Date();
    
    for (let day = 0; day < 60; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      
      // Generate 10-100 requests per day per API key
      const requestsPerDay = Math.floor(Math.random() * 90) + 10;
      
      for (let i = 0; i < requestsPerDay; i++) {
        const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]!;
        const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]!;
        const method = methods[Math.floor(Math.random() * methods.length)]!;
        
        // Weighted random status code
        let statusCode = 200;
        const rand = Math.random();
        let cumulative = 0;
        for (let j = 0; j < statusCodes.length && j < statusWeights.length; j++) {
          cumulative += statusWeights[j]!;
          if (rand <= cumulative) {
            statusCode = statusCodes[j]!;
            break;
          }
        }

        // Random timestamp within the day
        const timestamp = new Date(date);
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));
        timestamp.setSeconds(Math.floor(Math.random() * 60));

        logsToCreate.push({
          apiKeyId: apiKey._id,
          userId: apiKey.userId,
          endpoint,
          method,
          statusCode,
          responseTime: Math.floor(Math.random() * 2000) + 50, // 50-2050ms
          timestamp,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Test Data)',
          requestSize: Math.floor(Math.random() * 1000),
          responseSize: Math.floor(Math.random() * 5000)
        });
      }
    }

    console.log(`Creating ${logsToCreate.length} usage log entries...`);
    
    // Insert in batches to avoid memory issues
    const batchSize = 1000;
    for (let i = 0; i < logsToCreate.length; i += batchSize) {
      const batch = logsToCreate.slice(i, i + batchSize);
      await UsageLog.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(logsToCreate.length / batchSize)}`);
    }

    console.log('✅ Usage data seeded successfully!');
    
    // Show some stats
    const totalLogs = await UsageLog.countDocuments();
    const uniqueEndpoints = await UsageLog.distinct('endpoint');
    const dateRange = await UsageLog.aggregate([
      {
        $group: {
          _id: null,
          minDate: { $min: '$timestamp' },
          maxDate: { $max: '$timestamp' }
        }
      }
    ]);

    console.log('\n📊 Usage Data Statistics:');
    console.log(`Total logs: ${totalLogs}`);
    console.log(`Unique endpoints: ${uniqueEndpoints.length}`);
    console.log(`Date range: ${dateRange[0]?.minDate?.toISOString().split('T')[0]} to ${dateRange[0]?.maxDate?.toISOString().split('T')[0]}`);

  } catch (error) {
    console.error('Error seeding usage data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  seedUsageData();
}

export { seedUsageData };
