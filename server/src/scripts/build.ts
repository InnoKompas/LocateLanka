#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');
const DIST_DIR = join(ROOT_DIR, 'dist');

console.log('🏗️  Building LankaLocate Server...');

try {
  // Clean dist directory
  if (existsSync(DIST_DIR)) {
    console.log('🧹 Cleaning dist directory...');
    rmSync(DIST_DIR, { recursive: true, force: true });
  }

  // Create dist directory
  mkdirSync(DIST_DIR, { recursive: true });

  // Run TypeScript compiler
  console.log('📦 Compiling TypeScript...');
  execSync('tsc', { 
    stdio: 'inherit', 
    cwd: ROOT_DIR 
  });

  // Copy non-TS files if needed
  console.log('📋 Copying assets...');
  // Add any asset copying logic here if needed

  console.log('✅ Build completed successfully!');
  console.log(`📁 Output directory: ${DIST_DIR}`);

} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
