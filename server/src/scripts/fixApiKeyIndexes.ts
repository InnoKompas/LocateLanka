import { DatabaseConfig } from '../config/database.config';
import { ApiKey } from '../models/ApiKey.model';
import { logger } from '../config/logger.config';

async function fixApiKeyIndexes(): Promise<void> {
  const db = DatabaseConfig.getInstance();
  await db.connect();
  logger.info('Connected to database to inspect ApiKey indexes');

  const coll = ApiKey.collection;

  const indexes = await coll.indexes();
  logger.info('Current ApiKey indexes:', indexes);

  const indexesToDrop: string[] = [];

  for (const idx of indexes) {
    const keySpec = idx.key as Record<string, number>;
    const name = idx.name as string;

    // Drop any legacy unique indexes we no longer want
    const isLegacyNameCompound =
      keySpec['userId'] === 1 && keySpec['name'] === 1 && keySpec['isActive'] === 1;
    const isLegacyNameOnly = keySpec['name'] === 1;
    const isLegacyPlainKey = keySpec['key'] === 1; // legacy field that used to exist

    // Keep hashedKey_1 (unique) and other non-legacy indexes
    if (isLegacyNameCompound || isLegacyNameOnly || isLegacyPlainKey) {
      indexesToDrop.push(name);
    }
  }

  for (const name of indexesToDrop) {
    try {
      await coll.dropIndex(name);
      logger.warn(`Dropped legacy ApiKey index: ${name}`);
    } catch (err) {
      logger.error(`Failed to drop index ${name}:`, err);
    }
  }

  // Re-sync indexes so our model-defined indexes are ensured (including hashedKey unique)
  await ApiKey.syncIndexes();
  const finalIndexes = await coll.indexes();
  logger.info('Final ApiKey indexes:', finalIndexes);
}

fixApiKeyIndexes()
  .then(() => {
    logger.info('✅ ApiKey index fix complete');
    process.exit(0);
  })
  .catch((err) => {
    logger.error('❌ ApiKey index fix failed:', err);
    process.exit(1);
  });


