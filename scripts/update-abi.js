#!/usr/bin/env node
/**
 * Script to update the contract ABI in src/lib/contracts.ts
 * Run after recompiling contracts: npm run update-abi
 */

const fs = require('fs');
const path = require('path');

const ARTIFACT_PATH = path.join(__dirname, '../contracts/artifacts/contracts/contracts/HealthRecords.sol/HealthRecords.json');
const CONTRACTS_PATH = path.join(__dirname, '../src/lib/contracts.ts');

try {
    // Read the compiled artifact
    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
    const abi = artifact.abi;

    // Read the current contracts.ts file
    let contractsContent = fs.readFileSync(CONTRACTS_PATH, 'utf8');

    // Replace the ABI
    const abiString = JSON.stringify(abi, null, 2);
    const newAbiExport = `export const HEALTH_RECORDS_ABI = ${abiString} as const;`;

    // Find and replace the ABI export
    contractsContent = contractsContent.replace(
        /export const HEALTH_RECORDS_ABI = \[[\s\S]*?\] as const;/,
        newAbiExport
    );

    // Write back to file
    fs.writeFileSync(CONTRACTS_PATH, contractsContent, 'utf8');

    console.log('✅ Successfully updated contract ABI in src/lib/contracts.ts');
    console.log(`📝 ABI contains ${abi.length} items`);

    // List new functions
    const functions = abi.filter(item => item.type === 'function').map(item => item.name);
    console.log(`\n🔧 Available functions:`);
    functions.forEach(fn => console.log(`   - ${fn}`));

} catch (error) {
    console.error('❌ Error updating ABI:', error.message);
    process.exit(1);
}
