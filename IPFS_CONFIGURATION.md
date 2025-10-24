# IPFS Configuration Guide

## 🚨 Current Issue: 403 Forbidden Error

You're getting a 403 error because Pinata API credentials are not configured. Here are the solutions:

## Option 1: Configure Pinata (Recommended)

### Step 1: Get Pinata API Keys
1. Go to [Pinata Cloud](https://app.pinata.cloud/developers)
2. Sign up or log in
3. Navigate to "API Keys" in the dashboard
4. Click "New Key"
5. Set permissions:
   - ✅ `pinFileToIPFS` - Upload files
   - ✅ `pinJSONToIPFS` - Upload JSON metadata
   - ✅ `unpin` - Remove files (optional)
6. Copy your API Key and Secret Key

### Step 2: Create Environment File
Create `.env.local` in your project root:

```bash
# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key_here
```

### Step 3: Restart Development Server
```bash
npm run dev
# or
yarn dev
```

## Option 2: Use Web3.Storage (Alternative)

If you prefer Web3.Storage over Pinata:

### Step 1: Get Web3.Storage Token
1. Go to [Web3.Storage](https://web3.storage/)
2. Sign up with GitHub or email
3. Go to "API Tokens"
4. Create a new token
5. Copy the token

### Step 2: Update Environment
```bash
# Web3.Storage Configuration
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token_here
```

## Option 3: Use Local IPFS Node

For development, you can use a local IPFS node:

### Step 1: Install IPFS
```bash
# macOS
brew install ipfs

# Or download from https://ipfs.io/docs/install/
```

### Step 2: Start IPFS Node
```bash
ipfs init
ipfs daemon
```

### Step 3: Update Environment
```bash
# Local IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=http://localhost:8080
NEXT_PUBLIC_IPFS_API=http://localhost:5001
```

## Option 4: Use Public IPFS Gateways

For testing without API keys, you can use public gateways:

```bash
# Public IPFS Configuration (No API keys needed)
NEXT_PUBLIC_USE_PUBLIC_IPFS=true
```

## 🔧 Testing Your Configuration

After setting up credentials, test the upload:

1. Go to `/upload` page
2. Select a small video file (< 1MB for testing)
3. Click "Upload to IPFS"
4. Check browser console for any errors

## 🐛 Troubleshooting

### 403 Forbidden Error
- ✅ Check API keys are correct
- ✅ Verify API keys have proper permissions
- ✅ Ensure environment variables are loaded
- ✅ Restart development server after adding env vars

### 401 Unauthorized Error
- ✅ API key is invalid or expired
- ✅ Secret key is incorrect
- ✅ Account is suspended

### Network Errors
- ✅ Check internet connection
- ✅ Verify Pinata service is up
- ✅ Try alternative IPFS provider

## 📋 Environment Variables Reference

```bash
# Pinata (Primary)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key

# Web3.Storage (Alternative)
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token

# Local IPFS (Development)
NEXT_PUBLIC_IPFS_GATEWAY=http://localhost:8080
NEXT_PUBLIC_IPFS_API=http://localhost:5001

# Public IPFS (Testing)
NEXT_PUBLIC_USE_PUBLIC_IPFS=true
```

## 🎯 Next Steps

1. **Choose your IPFS provider** (Pinata recommended)
2. **Get API credentials** from your chosen provider
3. **Create `.env.local`** file with your credentials
4. **Restart your development server**
5. **Test the upload functionality**

The upload should work once credentials are properly configured!
