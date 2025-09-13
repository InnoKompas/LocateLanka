#!/usr/bin/env ts-node

import { DatabaseConfig } from '../config/database.config';

interface CollectionInfo {
  name: string;
}

async function checkDatabase() {
  console.log('🔍 Checking Database Collections...\n');
  
  try {
    const db = DatabaseConfig.getInstance();
    await db.connect();
    
    // Get database instance
    const actualDb = db.getDb();
    
    // List all collections
    const collections = await actualDb.listCollections().toArray();
    console.log('📋 Available Collections:');
    collections.forEach((col: CollectionInfo, index: number) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });
    
    if (collections.length === 0) {
      console.log('   ❌ No collections found in database');
      return;
    }
    
    console.log('\n📊 Collection Statistics:');
    
    // Check each collection
    for (const col of collections) {
      const collection = actualDb.collection(col.name);
      const count = await collection.countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
      
      // Show sample document if exists
      if (count > 0) {
        const sample = await collection.findOne();
        console.log(`   Sample document keys: ${Object.keys(sample || {}).join(', ')}`);
      }
    }
    
    // Specifically check for the expected collection
    const expectedCollection = process.env['GN_DIVISIONS_COLLECTION'] || 'gn_divisions_2020';
    console.log(`\n🎯 Checking expected collection: "${expectedCollection}"`);
    
    const targetCollection = actualDb.collection(expectedCollection);
    const targetCount = await targetCollection.countDocuments();
    
    if (targetCount === 0) {
      console.log('   ❌ Expected collection is empty or doesn\'t exist');
      console.log('   💡 You need to import your data into this collection');
      
      // Check for common collection names
      console.log('\n🔍 Looking for similar collections...');
      const similarNames = ['2020-data', 'gn_divisions', 'divisions', 'locations', 'lankalocate'];
      for (const name of similarNames) {
        const col = actualDb.collection(name);
        const count = await col.countDocuments();
        if (count > 0) {
          console.log(`   ✅ Found data in "${name}": ${count} documents`);
        }
      }
    } else {
      console.log(`   ✅ Found ${targetCount} documents in expected collection`);
      
      // Show sample document structure
      const sample = await targetCollection.findOne();
      if (sample) {
        console.log('\n📄 Sample Document Structure:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }
    
    await db.disconnect();
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();
