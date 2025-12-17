#!/usr/bin/env node
/**
 * Script to push Prisma schema to production database
 * Run with: node scripts/push-schema-to-production.js
 */

const { execSync } = require('child_process');

console.log('🔄 Pushing Prisma schema to production database...');

try {
    // Run prisma db push
    execSync('npx prisma db push --accept-data-loss', {
        stdio: 'inherit',
        env: { ...process.env }
    });

    console.log('✅ Schema push completed successfully!');
    process.exit(0);
} catch (error) {
    console.error('❌ Schema push failed:', error.message);
    process.exit(1);
}
