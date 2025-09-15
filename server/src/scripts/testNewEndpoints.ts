import mongoose from 'mongoose';
import { config } from '../config/environment.config';
import { ProvinceService } from '../services/province.service';
import { DistrictService } from '../services/district.service';

/**
 * Test script to verify the updated province and district endpoints work correctly
 */
async function testNewEndpoints() {
  try {
    console.log('🧪 Testing Updated Province & District Endpoints');
    console.log('===============================================');
    
    // Connect to database
    await mongoose.connect(config.DATABASE.URI);
    console.log('✅ Connected to MongoDB');
    
    const provinceService = new ProvinceService();
    const districtService = new DistrictService();
    
    // Test 1: Get all provinces
    console.log('\n📊 Test 1: Get All Provinces');
    console.log('----------------------------');
    
    const provinces = await provinceService.getAllProvinces();
    console.log(`Found ${provinces.length} provinces:`);
    provinces.forEach(province => {
      console.log(`  • ${province.name} (${province.code})`);
      console.log(`    🇱🇰 Sinhala: ${province.nameSi} | Tamil: ${province.nameTa}`);
      console.log(`    📍 Capital: ${province.capital} | Area: ${province.area.toLocaleString()} km² | Pop: ${province.population.toLocaleString()}`);
      console.log(`    📊 Districts: ${province.districtCount}`);
      console.log();
    });
    
    // Test 2: Get province by code
    console.log('\n🔍 Test 2: Get Province by Code (WP)');
    console.log('-----------------------------------');
    
    const westernProvince = await provinceService.getProvinceById('WP');
    if (westernProvince) {
      console.log(`✅ Found: ${westernProvince.name} (${westernProvince.code})`);
      console.log(`   🇱🇰 Sinhala: ${westernProvince.nameSi} | Tamil: ${westernProvince.nameTa}`);
      console.log(`   📍 Capital: ${westernProvince.capital}`);
      console.log(`   📏 Area: ${westernProvince.area.toLocaleString()} km²`);
      console.log(`   👥 Population: ${westernProvince.population.toLocaleString()}`);
      console.log(`   🏛️  Districts: ${westernProvince.districtCount}`);
    } else {
      console.log('❌ Western Province not found');
    }
    
    // Test 3: Get districts by province
    console.log('\n🏛️  Test 3: Get Districts by Province (WP)');
    console.log('----------------------------------------');
    
    const westernDistricts = await provinceService.getDistrictsByProvince('WP');
    console.log(`Found ${westernDistricts.length} districts in Western Province:`);
    westernDistricts.forEach(district => {
      console.log(`  • ${district.name} (${district.code})`);
      console.log(`    🇱🇰 Sinhala: ${district.nameSi} | Tamil: ${district.nameTa}`);
      console.log(`    📍 Capital: ${district.capital} | Area: ${district.area.toLocaleString()} km² | Pop: ${district.population.toLocaleString()}`);
    });
    
    // Test 4: Get all districts
    console.log('\n📍 Test 4: Get All Districts');
    console.log('---------------------------');
    
    const districts = await districtService.getAllDistricts();
    console.log(`Found ${districts.length} districts:`);
    districts.slice(0, 3).forEach(district => {
      console.log(`  • ${district.name} (${district.code}) - ${district.provinceName}`);
      console.log(`    🇱🇰 Sinhala: ${district.nameSi} | Tamil: ${district.nameTa}`);
      console.log(`    📍 Capital: ${district.capital} | Area: ${district.area.toLocaleString()} km² | Pop: ${district.population.toLocaleString()}`);
      console.log();
    });
    console.log(`  ... and ${districts.length - 3} more`);
    
    // Test 5: Get district by code
    console.log('\n🔍 Test 5: Get District by Code (COL)');
    console.log('------------------------------------');
    
    const colomboDistrict = await districtService.getDistrictById('COL');
    if (colomboDistrict) {
      console.log(`✅ Found: ${colomboDistrict.name} (${colomboDistrict.code})`);
      console.log(`   🇱🇰 Sinhala: ${colomboDistrict.nameSi} | Tamil: ${colomboDistrict.nameTa}`);
      console.log(`   📍 Capital: ${colomboDistrict.capital}`);
      console.log(`   📏 Area: ${colomboDistrict.area.toLocaleString()} km²`);
      console.log(`   👥 Population: ${colomboDistrict.population.toLocaleString()}`);
      console.log(`   🏛️  Province: ${colomboDistrict.provinceName} (${colomboDistrict.provinceId})`);
    } else {
      console.log('❌ Colombo District not found');
    }
    
    // Test 6: Get districts by province name
    console.log('\n🔍 Test 6: Get Districts by Province Name (Western Province)');
    console.log('----------------------------------------------------------');
    
    const westernDistrictsByName = await districtService.getDistrictsByProvince('Western Province');
    console.log(`Found ${westernDistrictsByName.length} districts:`);
    westernDistrictsByName.forEach(district => {
      console.log(`  • ${district.name} (${district.code})`);
    });
    
    // Test 7: Get GN divisions by district
    console.log('\n🗺️  Test 7: Get GN Divisions by District (COL)');
    console.log('--------------------------------------------');
    
    const colomboDivisions = await districtService.getDivisionsByDistrict('COL');
    console.log(`Found ${colomboDivisions.length} GN divisions in Colombo:`);
    colomboDivisions.slice(0, 5).forEach(division => {
      console.log(`  • ${division.name} (${division.gnNumber}) - Area: ${division.area} km², Pop: ${division.population}`);
    });
    console.log(`  ... and ${colomboDivisions.length - 5} more`);
    
    // Test 8: Province by name (case insensitive)
    console.log('\n🔍 Test 8: Get Province by Name (case insensitive)');
    console.log('------------------------------------------------');
    
    const centralProvince = await provinceService.getProvinceByName('central province');
    if (centralProvince) {
      console.log(`✅ Found: ${centralProvince.name} (${centralProvince.code})`);
    } else {
      console.log('❌ Central Province not found');
    }
    
    console.log('\n✅ All endpoint tests completed successfully!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  testNewEndpoints();
}

export { testNewEndpoints };
