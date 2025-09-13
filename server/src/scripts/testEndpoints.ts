#!/usr/bin/env ts-node

import axios from 'axios';
import { config } from '../config/environment.config';

const BASE_URL = `http://localhost:${config.PORT}`;
const API_KEY = 'lk_test_key_12345'; // Test API key

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

class EndpointTester {
  private results: TestResult[] = [];
  private headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
  };

  async testEndpoint(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET',
    expectedStatus: number = 200
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        headers: this.headers,
        timeout: 10000
      });

      const responseTime = Date.now() - startTime;
      const result: TestResult = {
        endpoint,
        method,
        status: response.status === expectedStatus ? 'PASS' : 'FAIL',
        statusCode: response.status,
        responseTime
      };

      if (response.status !== expectedStatus) {
        result.error = `Expected ${expectedStatus}, got ${response.status}`;
      }

      return result;
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        endpoint,
        method,
        status: 'FAIL',
        statusCode: error.response?.status,
        responseTime,
        error: error.message
      };
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Testing LankaLocate API Endpoints');
    console.log('====================================\n');

    // Health endpoints (no auth required)
    console.log('📊 Health & Monitoring Endpoints:');
    this.results.push(await this.testEndpoint('/health'));
    this.results.push(await this.testEndpoint('/health/detailed'));
    this.results.push(await this.testEndpoint('/ready'));
    this.results.push(await this.testEndpoint('/live'));
    this.results.push(await this.testEndpoint('/metrics'));

    // API info endpoint
    console.log('\n📋 API Info:');
    this.results.push(await this.testEndpoint('/api/v1'));

    // Provinces endpoints
    console.log('\n🏛️ Provinces API:');
    this.results.push(await this.testEndpoint('/api/v1/provinces'));
    this.results.push(await this.testEndpoint('/api/v1/provinces/1'));
    this.results.push(await this.testEndpoint('/api/v1/provinces/1/districts'));

    // Districts endpoints
    console.log('\n🏘️ Districts API:');
    this.results.push(await this.testEndpoint('/api/v1/districts'));
    this.results.push(await this.testEndpoint('/api/v1/districts?province=Western'));
    this.results.push(await this.testEndpoint('/api/v1/districts/1'));
    this.results.push(await this.testEndpoint('/api/v1/districts/1/divisions'));

    // DSDs endpoints
    console.log('\n🏢 DSDs API:');
    this.results.push(await this.testEndpoint('/api/v1/dsds'));
    this.results.push(await this.testEndpoint('/api/v1/dsds?district=Colombo'));
    this.results.push(await this.testEndpoint('/api/v1/dsds/24'));
    this.results.push(await this.testEndpoint('/api/v1/dsds/24/divisions'));

    // Divisions endpoints
    console.log('\n🏠 GN Divisions API:');
    this.results.push(await this.testEndpoint('/api/v1/divisions?limit=5'));
    this.results.push(await this.testEndpoint('/api/v1/divisions?province=Western&limit=3'));
    this.results.push(await this.testEndpoint('/api/v1/divisions?district=Colombo&limit=3'));
    this.results.push(await this.testEndpoint('/api/v1/divisions?minPopulation=5000&limit=3'));
    this.results.push(await this.testEndpoint('/api/v1/divisions/search?q=Colombo&limit=3'));

    // Print results
    this.printResults();
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary:');
    console.log('========================\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;

    // Print each result
    this.results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      const time = result.responseTime ? `${result.responseTime}ms` : 'N/A';
      const statusCode = result.statusCode ? `[${result.statusCode}]` : '';
      
      console.log(`${status} ${result.method} ${result.endpoint} ${statusCode} (${time})`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log(`\n📈 Summary: ${passed} passed, ${failed} failed (${this.results.length} total)`);
    
    if (failed > 0) {
      console.log('\n❌ Some tests failed. Check the server logs and ensure:');
      console.log('   - Server is running on the correct port');
      console.log('   - Database is connected');
      console.log('   - API key is valid');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed! API is working correctly.');
    }
  }

  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
      return response.status === 200 && response.data.status === 'healthy';
    } catch {
      return false;
    }
  }
}

// Main execution
async function main(): Promise<void> {
  const tester = new EndpointTester();

  console.log(`🔍 Checking server health at ${BASE_URL}...`);
  
  const isHealthy = await tester.checkServerHealth();
  if (!isHealthy) {
    console.error('❌ Server is not running or unhealthy!');
    console.error('   Please start the server with: pnpm dev');
    process.exit(1);
  }

  console.log('✅ Server is healthy, starting tests...\n');
  
  await tester.runAllTests();
}

// Run tests
main().catch(error => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});
