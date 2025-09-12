import { Db, MongoClient } from 'mongodb';

let db: Db | null = null;

export async function connectDb(uri: string, dbName: string) {
  if (db) return db;
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error('DB not connected');
  return db;
}
