#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ClipClash IPFS Setup Helper\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file already exists');
  console.log('📝 Please add your IPFS credentials to the existing file\n');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# IPFS Configuration for ClipClash
# Choose one of the following options:

# Option 1: Pinata (Recommended)
# Get your API keys from https://app.pinata.cloud/developers
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here

# Option 2: Web3.Storage (Alternative)
# Get your token from https://web3.storage/
# NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# Option 3: Public IPFS (Testing - No API keys needed)
# NEXT_PUBLIC_USE_PUBLIC_IPFS=true

# Option 4: Local IPFS (Development)
# NEXT_PUBLIC_IPFS_GATEWAY=http://localhost:8080
# NEXT_PUBLIC_IPFS_API=http://localhost:5001
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully\n');
}

console.log('🔧 Next Steps:');
console.log('1. Choose your IPFS provider:');
console.log('   • Pinata (Recommended): https://app.pinata.cloud/developers');
console.log('   • Web3.Storage (Free): https://web3.storage/');
console.log('   • Public IPFS (Testing): Set NEXT_PUBLIC_USE_PUBLIC_IPFS=true');
console.log('');
console.log('2. Get your API credentials from your chosen provider');
console.log('');
console.log('3. Update the .env.local file with your credentials');
console.log('');
console.log('4. Restart your development server:');
console.log('   npm run dev');
console.log('');
console.log('5. Try uploading a video again');
console.log('');
console.log('📚 For more help, see: IPFS_CONFIGURATION.md');
