import mongoose from 'mongoose';
import { config } from '../config/environment.config';
import { DatabaseService } from '../services/database.service';
import { DSDService } from '../services/dsd.service';
import { DivisionService } from '../services/division.service';

/**
 * Test script to verify the updated DSD and Division services work correctly
 * with the new simplified GN divisions data structure
 */
async function testUpdatedServices() {
  try {
    console.log('🧪 Testing Updated DSD & Division Services');
    console.log('==========================================');
    
    // Connect to database
    await mongoose.connect(config.DATABASE.URI);
    console.log('✅ Connected to MongoDB');
    
    // Initialize DatabaseService
    const dbService = DatabaseService.getInstance();
    await dbService.connect();
    console.log('✅ DatabaseService initialized');
    
    const dsdService = new DSDService();
    const divisionService = new DivisionService();
    
    // Test 1: Get all DSDs
    console.log('\n📊 Test 1: Get All DSDs');
    console.log('----------------------');
    
    const dsds = await dsdService.getAllDSDs();
    console.log(`Found ${dsds.length} DSDs:`);
    dsds.slice(0, 5).forEach(dsd => {
      console.log(`  • ${dsd.name} - ${dsd.districtName}, ${dsd.provinceName} (${dsd.divisionCount} divisions)`);
    });
    console.log(`  ... and ${dsds.length - 5} more`);
    
    // Test 2: Get DSDs by district
    console.log('\n🏛️  Test 2: Get DSDs by District (Ampara)');
    console.log('---------------------------------------');
    
    const amparaDSDs = await dsdService.getDSDsByDistrict('AMPARA');
    console.log(`Found ${amparaDSDs.length} DSDs in Ampara district:`);
    amparaDSDs.forEach(dsd => {
      console.log(`  • ${dsd.name} (${dsd.divisionCount} divisions)`);
    });
    
    // Test 3: Get DSDs by province
    console.log('\n🗺️  Test 3: Get DSDs by Province (Eastern)');
    console.log('---------------------------------------');
    
    const easternDSDs = await dsdService.getDSDsByProvince('Eastern');
    console.log(`Found ${easternDSDs.length} DSDs in Eastern Province:`);
    easternDSDs.slice(0, 5).forEach(dsd => {
      console.log(`  • ${dsd.name} - ${dsd.districtName} (${dsd.divisionCount} divisions)`);
    });
    if (easternDSDs.length > 5) {
      console.log(`  ... and ${easternDSDs.length - 5} more`);
    }
    
    // Test 4: Get DSD by name
    console.log('\n🔍 Test 4: Get DSD by Name (PADIYATHALAWA)');
    console.log('------------------------------------------');
    
    const padiyathalawaDSD = await dsdService.getDSDById('PADIYATHALAWA');
    if (padiyathalawaDSD) {
      console.log(`✅ Found: ${padiyathalawaDSD.name}`);
      console.log(`   District: ${padiyathalawaDSD.districtName} (${padiyathalawaDSD.districtId})`);
      console.log(`   Province: ${padiyathalawaDSD.provinceName} (${padiyathalawaDSD.provinceId})`);
      console.log(`   Divisions: ${padiyathalawaDSD.divisionCount}`);
    } else {
      console.log('❌ DSD not found');
    }
    
    // Test 5: Get divisions by DSD
    console.log('\n📍 Test 5: Get Divisions by DSD (PADIYATHALAWA)');
    console.log('----------------------------------------------');
    
    const padiyathalawaDiv = await dsdService.getDivisionsByDSD('PADIYATHALAWA');
    console.log(`Found ${padiyathalawaDiv.length} divisions in PADIYATHALAWA DSD:`);
    padiyathalawaDiv.slice(0, 5).forEach(division => {
      console.log(`  • ${division.name} (${division.gnNumber})`);
      console.log(`    Area: ${division.area} km², Population: ${division.population}`);
      console.log(`    District: ${division.districtName}, Province: ${division.provinceName}`);
      console.log();
    });
    if (padiyathalawaDiv.length > 5) {
      console.log(`  ... and ${padiyathalawaDiv.length - 5} more`);
    }
    
    // Test 6: Get divisions with filters
    console.log('\n🔍 Test 6: Get Divisions with Filters (District: Ampara)');
    console.log('------------------------------------------------------');
    
    const amparaResult = await divisionService.getDivisions({
      district: 'AMPARA',
      limit: 5
    });
    
    console.log(`Found ${amparaResult.total} total divisions in Ampara district (showing first 5):`);
    amparaResult.divisions.forEach(division => {
      console.log(`  • ${division.name} (${division.gnNumber})`);
      console.log(`    🇱🇰 Sinhala: ${division.nameSi || 'N/A'}`);
      console.log(`    📍 DSD: ${division.dsdName}`);
      console.log(`    📏 Area: ${division.area} km², 👥 Population: ${division.population}`);
      console.log();
    });
    
    // Test 7: Search divisions
    console.log('\n🔎 Test 7: Search Divisions (query: "Miriswatta")');
    console.log('-----------------------------------------------');
    
    const searchResults = await divisionService.searchDivisions('Miriswatta', 5);
    console.log(`Found ${searchResults.length} divisions matching "Miriswatta":`);
    searchResults.forEach(division => {
      console.log(`  • ${division.name} (${division.gnNumber})`);
      console.log(`    🇱🇰 Sinhala: ${division.nameSi || 'N/A'}`);
      console.log(`    📍 District: ${division.districtName}, Province: ${division.provinceName}`);
      console.log(`    📏 Area: ${division.area} km², 👥 Population: ${division.population}`);
      console.log();
    });
    
    // Test 8: Get divisions by province filter
    console.log('\n🗺️  Test 8: Get Divisions by Province Filter (Eastern)');
    console.log('--------------------------------------------------');
    
    const easternResult = await divisionService.getDivisions({
      province: 'Eastern',
      limit: 3
    });
    
    console.log(`Found ${easternResult.total} total divisions in Eastern Province (showing first 3):`);
    easternResult.divisions.forEach(division => {
      console.log(`  • ${division.name} (${division.gnNumber}) - ${division.dsdName}`);
      console.log(`    📍 District: ${division.districtName}`);
      console.log();
    });
    
    console.log('\n✅ All service tests completed successfully!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ Error testing services:', error);
  } finally {
    const dbService = DatabaseService.getInstance();
    await dbService.disconnect();
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  testUpdatedServices();
}

export { testUpdatedServices };
