#!/usr/bin/env ts-node

import { DatabaseConfig } from '../config/database.config';
import { ApiKeyService } from '../services/apiKey.service';
import { ApiKey } from '../models/ApiKey.model';

interface CreateKeyOptions {
  userId?: string;
  name?: string;
  description?: string | undefined;
  environment?: 'development' | 'staging' | 'production';
  permissions?: string[];
  expiresInDays?: number | undefined;
}

class ApiKeyManager {
  async createApiKey(options: CreateKeyOptions): Promise<void> {
    try {
      const expiresAt = options.expiresInDays 
        ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;

      if (!options.userId || !options.name) {
        throw new Error('userId and name are required');
      }

      const apiKey = await ApiKeyService.createApiKey({
        userId: options.userId,
        name: options.name,
        description: options.description || undefined,
        environment: options.environment || 'development',
        permissions: options.permissions || ['read:all'],
        expiresAt
      });

      console.log('✅ API Key created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🔑 API Key: ${apiKey.key}`);
      console.log(`📝 Name: ${apiKey.name}`);
      console.log(`👤 User ID: ${apiKey.userId}`);
      console.log(`🌍 Environment: ${apiKey.metadata.environment}`);
      console.log(`🔐 Permissions: ${apiKey.permissions.join(', ')}`);
      console.log(`📊 Rate Limits:`);
      console.log(`   • Daily: ${apiKey.rateLimit.requestsPerDay} requests`);
      console.log(`   • Monthly: ${apiKey.rateLimit.requestsPerMonth} requests`);
      if (apiKey.expiresAt) {
        console.log(`⏰ Expires: ${apiKey.expiresAt.toISOString()}`);
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  IMPORTANT: This is the only time the full API key will be shown.');
      console.log('   Please save it securely. You cannot retrieve it again.');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('❌ Failed to create API key:', error);
    }
  }

  async listApiKeys(userId?: string): Promise<void> {
    try {
      let apiKeys;
      
      if (userId) {
        apiKeys = await ApiKeyService.getUserApiKeys(userId);
        console.log(`📋 API Keys for User ID: ${userId}`);
      } else {
        apiKeys = await ApiKey.find({ isActive: true })
          .populate('userId', 'email firstName lastName')
          .select('-hashedKey')
          .sort({ createdAt: -1 });
        console.log('📋 All Active API Keys:');
      }

      if (apiKeys.length === 0) {
        console.log('   No API keys found.');
        return;
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      apiKeys.forEach((key: any, index: number) => {
        console.log(`${index + 1}. ${key.name}`);
        console.log(`   🆔 ID: ${key._id}`);
        console.log(`   🔑 Key Prefix: ${key.keyPrefix}_***`);
        console.log(`   👤 User: ${key.userId?.email || key.userId}`);
        console.log(`   🌍 Environment: ${key.metadata.environment}`);
        console.log(`   📊 Usage: ${key.usage.totalRequests} total, ${key.usage.requestsToday} today`);
        console.log(`   📅 Created: ${new Date(key.createdAt).toLocaleDateString()}`);
        if (key.usage.lastUsed) {
          console.log(`   🕐 Last Used: ${new Date(key.usage.lastUsed).toLocaleString()}`);
        }
        console.log('   ─────────────────────────────────────────────────────────────────────────────────────');
      });
    } catch (error) {
      console.error('❌ Failed to list API keys:', error);
    }
  }

  async deactivateApiKey(keyId: string): Promise<void> {
    try {
      await ApiKey.updateOne({ _id: keyId }, { isActive: false });
      console.log(`✅ API Key ${keyId} has been deactivated.`);
    } catch (error) {
      console.error('❌ Failed to deactivate API key:', error);
    }
  }

  async cleanupExpiredKeys(): Promise<void> {
    try {
      const count = await ApiKeyService.cleanupExpiredKeys();
      console.log(`✅ Cleaned up ${count} expired API keys.`);
    } catch (error) {
      console.error('❌ Failed to cleanup expired keys:', error);
    }
  }

  async showUsageStats(keyId?: string): Promise<void> {
    try {
      if (keyId) {
        const key = await ApiKey.findById(keyId).populate('userId', 'email');
        if (!key) {
          console.log('❌ API key not found.');
          return;
        }

        console.log(`📊 Usage Statistics for: ${key.name}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🔑 Key: ${key.keyPrefix}_***`);
        console.log(`👤 User: ${(key.userId as any)?.email || key.userId}`);
        console.log(`📈 Total Requests: ${key.usage.totalRequests}`);
        console.log(`📅 Today: ${key.usage.requestsToday} / ${key.rateLimit.requestsPerDay} (${((key.usage.requestsToday / key.rateLimit.requestsPerDay) * 100).toFixed(1)}%)`);
        console.log(`📆 This Month: ${key.usage.requestsThisMonth} / ${key.rateLimit.requestsPerMonth} (${((key.usage.requestsThisMonth / key.rateLimit.requestsPerMonth) * 100).toFixed(1)}%)`);
        if (key.usage.lastUsed) {
          console.log(`🕐 Last Used: ${new Date(key.usage.lastUsed).toLocaleString()}`);
          console.log(`🎯 Last Endpoint: ${key.usage.lastUsedEndpoint || 'N/A'}`);
          console.log(`🌐 Last IP: ${key.usage.lastUsedIP || 'N/A'}`);
        }
      } else {
        // Show overall stats
        const stats = await ApiKey.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: null,
              totalKeys: { $sum: 1 },
              totalRequests: { $sum: '$usage.totalRequests' },
              totalRequestsToday: { $sum: '$usage.requestsToday' },
              totalRequestsThisMonth: { $sum: '$usage.requestsThisMonth' }
            }
          }
        ]);

        const overall = stats[0] || { totalKeys: 0, totalRequests: 0, totalRequestsToday: 0, totalRequestsThisMonth: 0 };

        console.log('📊 Overall API Usage Statistics');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🔑 Total Active Keys: ${overall.totalKeys}`);
        console.log(`📈 Total Requests: ${overall.totalRequests.toLocaleString()}`);
        console.log(`📅 Requests Today: ${overall.totalRequestsToday.toLocaleString()}`);
        console.log(`📆 Requests This Month: ${overall.totalRequestsThisMonth.toLocaleString()}`);
      }
    } catch (error) {
      console.error('❌ Failed to show usage stats:', error);
    }
  }
}

// CLI Interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    const db = DatabaseConfig.getInstance();
    await db.connect();

    const manager = new ApiKeyManager();

    switch (command) {
      case 'create':
        if (args.length < 3) {
          console.log('Usage: pnpm run manage:keys create <userId> <name> [description] [environment] [expiresInDays]');
          process.exit(1);
        }
        await manager.createApiKey({
          userId: args[1] || '',
          name: args[2] || '',
          description: args[3] || undefined,
          environment: (args[4] as any) || 'development',
          expiresInDays: args[5] ? parseInt(args[5]) : undefined
        });
        break;

      case 'list':
        await manager.listApiKeys(args[1]);
        break;

      case 'deactivate':
        if (!args[1]) {
          console.log('Usage: pnpm run manage:keys deactivate <keyId>');
          process.exit(1);
        }
        await manager.deactivateApiKey(args[1]);
        break;

      case 'cleanup':
        await manager.cleanupExpiredKeys();
        break;

      case 'stats':
        await manager.showUsageStats(args[1]);
        break;

      default:
        console.log('🔑 LankaLocate API Key Manager');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Available commands:');
        console.log('  create <userId> <name> [description] [environment] [expiresInDays]');
        console.log('  list [userId]');
        console.log('  deactivate <keyId>');
        console.log('  cleanup');
        console.log('  stats [keyId]');
        console.log('');
        console.log('Examples:');
        console.log('  pnpm run manage:keys create 507f1f77bcf86cd799439011 "My API Key" "For my app" production 30');
        console.log('  pnpm run manage:keys list');
        console.log('  pnpm run manage:keys stats');
        console.log('  pnpm run manage:keys cleanup');
        break;
    }

    await db.disconnect();
  } catch (error) {
    console.error('❌ Command failed:', error);
    process.exit(1);
  }
}

main();
