import { DatabaseConfig } from '../config/database.config';
import { UsageLog } from '../models/UsageLog.model';
import { logger } from '../config/logger.config';

const testUsageLogging = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for usage logging test');

    // Check recent usage logs
    const recentLogs = await UsageLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'email firstName lastName')
      .populate('apiKeyId', 'name');

    console.log('\n🔍 Recent Usage Logs:');
    console.log('=====================');

    if (recentLogs.length === 0) {
      console.log('❌ No usage logs found. Make sure to call API endpoints with valid API keys.');
    } else {
      recentLogs.forEach((log, index) => {
        console.log(`\n${index + 1}. ${log.method} ${log.endpoint}`);
        console.log(`   Status: ${log.statusCode}`);
        console.log(`   Response Time: ${log.responseTime}ms`);
        console.log(`   User: ${(log.userId as any)?.email || 'Unknown'}`);
        console.log(`   API Key: ${(log.apiKeyId as any)?.name || 'Unknown'}`);
        console.log(`   Timestamp: ${log.timestamp}`);
        console.log(`   IP: ${log.ipAddress}`);
      });
    }

    // Get usage statistics
    const totalLogs = await UsageLog.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayLogs = await UsageLog.countDocuments({
      timestamp: { $gte: todayStart }
    });

    const endpointStats = await UsageLog.aggregate([
      {
        $group: {
          _id: '$endpoint',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    console.log('\n📊 Usage Statistics:');
    console.log('====================');
    console.log(`Total API calls logged: ${totalLogs}`);
    console.log(`API calls today: ${todayLogs}`);
    
    console.log('\n🔥 Top Endpoints:');
    endpointStats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat._id}: ${stat.count} calls (avg ${Math.round(stat.avgResponseTime)}ms)`);
    });

    console.log('\n✅ Usage logging test completed successfully!');

  } catch (error) {
    logger.error('❌ Error testing usage logging:', error);
    console.error('Failed to test usage logging:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await testUsageLogging();
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

export { testUsageLogging };
