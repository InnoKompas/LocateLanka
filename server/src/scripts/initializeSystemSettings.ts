import { SystemSettings } from '../models/SystemSettings.model';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';

const initializeSystemSettings = async (): Promise<void> => {
  try {
    // Initialize database connection
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Connected to database for system settings initialization');

    // Check if settings already exist
    const existingSettings = await SystemSettings.findOne();
    
    if (existingSettings) {
      console.log('✅ System settings already exist');
      console.log('Current settings:');
      console.log(JSON.stringify(existingSettings, null, 2));
      return;
    }

    // Create default system settings
    const defaultSettings = await SystemSettings.create({
      rateLimits: {
        free: {
          requestsPerHour: 100,
          requestsPerDay: 1000,
          requestsPerMonth: 10000
        },
        pro: {
          requestsPerHour: 1000,
          requestsPerDay: 10000,
          requestsPerMonth: 100000
        },
        enterprise: {
          requestsPerHour: 10000,
          requestsPerDay: 100000,
          requestsPerMonth: 1000000
        }
      },
      apiKeyLimits: {
        free: 2,
        pro: 10,
        enterprise: -1
      },
      maintenanceMode: false,
      globalAnnouncement: null
    });

    console.log('🎉 System settings initialized successfully!');
    console.log('Default settings created:');
    console.log(JSON.stringify(defaultSettings, null, 2));

    logger.info('System settings initialized with default values');

  } catch (error) {
    logger.error('❌ Error initializing system settings:', error);
    console.error('Failed to initialize system settings:', error);
    throw error;
  }
};

// Main execution
const main = async (): Promise<void> => {
  try {
    await initializeSystemSettings();
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

export { initializeSystemSettings };
