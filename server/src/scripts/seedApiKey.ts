import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env["MONGO_URI"] || 'mongodb://localhost:27017/locatelanka';
const dbName = process.env["DB_NAME"] || 'locatelanka';

async function seedApiKey() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const apiKey = randomUUID();
    await db.collection('api_keys').insertOne({
      key: apiKey,
      active: true,
      role: 'admin',
      createdAt: new Date(),
      description: 'Admin API key seed',
    });
    console.log('Admin API key seeded:', apiKey);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed API key:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedApiKey();
