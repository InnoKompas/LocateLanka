#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '../..');

interface DeployOptions {
  environment: 'staging' | 'production';
  skipTests?: boolean;
  skipBuild?: boolean;
  dockerTag?: string;
}

const deploy = async (options: DeployOptions): Promise<void> => {
  const { environment, skipTests = false, skipBuild = false, dockerTag } = options;
  
  console.log(`🚀 Starting deployment to ${environment}...`);
  
  try {
    // 1. Validate environment
    const envFile = join(ROOT_DIR, `.env.${environment}`);
    if (!existsSync(envFile)) {
      throw new Error(`Environment file .env.${environment} not found`);
    }
    
    // 2. Run tests (if not skipped)
    if (!skipTests) {
      console.log('🧪 Running tests...');
      execSync('npm run test', { stdio: 'inherit', cwd: ROOT_DIR });
    }
    
    // 3. Type checking
    console.log('🔍 Type checking...');
    execSync('npm run typecheck', { stdio: 'inherit', cwd: ROOT_DIR });
    
    // 4. Linting
    console.log('📋 Linting...');
    execSync('npm run lint', { stdio: 'inherit', cwd: ROOT_DIR });
    
    // 5. Build application (if not skipped)
    if (!skipBuild) {
      console.log('🏗️  Building application...');
      execSync('npm run build:clean', { stdio: 'inherit', cwd: ROOT_DIR });
    }
    
    // 6. Health check
    console.log('💚 Running health check...');
    execSync('npm run test:health', { stdio: 'inherit', cwd: ROOT_DIR });
    
    // 7. Docker build (if tag provided)
    if (dockerTag) {
      console.log(`🐳 Building Docker image: ${dockerTag}...`);
      execSync(`docker build -t ${dockerTag} .`, { stdio: 'inherit', cwd: ROOT_DIR });
      
      console.log(`📤 Pushing Docker image: ${dockerTag}...`);
      execSync(`docker push ${dockerTag}`, { stdio: 'inherit', cwd: ROOT_DIR });
    }
    
    console.log(`✅ Deployment to ${environment} completed successfully!`);
    
    // 8. Post-deployment tasks
    console.log('📋 Post-deployment checklist:');
    console.log('  - Update environment variables');
    console.log('  - Run database migrations if needed');
    console.log('  - Monitor application logs');
    console.log('  - Verify health endpoints');
    
  } catch (error) {
    console.error(`❌ Deployment failed:`, error);
    process.exit(1);
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0] as 'staging' | 'production';
const skipTests = args.includes('--skip-tests');
const skipBuild = args.includes('--skip-build');
const dockerTagIndex = args.indexOf('--docker-tag');
const dockerTag = dockerTagIndex !== -1 ? args[dockerTagIndex + 1] : undefined;

if (!environment || !['staging', 'production'].includes(environment)) {
  console.error('Usage: npm run deploy <staging|production> [--skip-tests] [--skip-build] [--docker-tag <tag>]');
  process.exit(1);
}

deploy({
  environment,
  skipTests,
  skipBuild,
  ...(dockerTag && { dockerTag })
});
