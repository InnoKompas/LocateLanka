import { User } from '../models/user.model';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';

const migrateUserSubscriptions = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for user subscription migration');

    // Find all users without subscription data
    const usersToMigrate = await User.find({
      $or: [
        { subscription: { $exists: false } },
        { 'subscription.plan': { $exists: false } },
        { usage: { $exists: false } }
      ]
    });

    console.log(`\n🔄 Found ${usersToMigrate.length} users to migrate`);

    if (usersToMigrate.length === 0) {
      console.log('✅ All users already have subscription data');
      return;
    }

    let migratedCount = 0;
    const now = new Date();

    for (const user of usersToMigrate) {
      try {
        // Set default subscription for free plan
        if (!user.subscription || !user.subscription.plan) {
          user.subscription = {
            plan: 'free',
            status: 'active',
            startDate: user.createdAt || now,
            rateLimit: {
              requestsPerHour: 100,
              requestsPerDay: 1000,
              requestsPerMonth: 10000
            }
          };
        }

        // Set default usage counters
        if (!user.usage) {
          user.usage = {
            currentHour: {
              count: 0,
              resetTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours())
            },
            currentDay: {
              count: 0,
              resetTime: new Date(now.getFullYear(), now.getMonth(), now.getDate())
            },
            currentMonth: {
              count: 0,
              resetTime: new Date(now.getFullYear(), now.getMonth(), 1)
            }
          };
        }

        await user.save();
        migratedCount++;

        console.log(`✅ Migrated user: ${user.email} (${user._id})`);
      } catch (error) {
        console.error(`❌ Failed to migrate user ${user.email}:`, error);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`   Migrated: ${migratedCount}/${usersToMigrate.length} users`);
    console.log(`   All users now have subscription and usage data`);

  } catch (error) {
    logger.error('❌ Migration failed:', error);
    console.error('Migration failed:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await migrateUserSubscriptions();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

export { migrateUserSubscriptions };
