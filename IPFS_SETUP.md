# IPFS Setup Guide

## Pinata Configuration

To use IPFS uploads for video battles, you need to configure Pinata:

### 1. Get Pinata API Keys

1. Go to [Pinata Cloud](https://app.pinata.cloud/developers)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key with the following permissions:
   - `pinFileToIPFS` - Upload files
   - `pinJSONToIPFS` - Upload JSON metadata
   - `unpin` - Remove files (optional)

### 2. Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Pinata IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here
```

### 3. Features

The IPFS upload system includes:

- ✅ **Video Upload**: Upload 15-second battle videos
- ✅ **Progress Tracking**: Real-time upload progress
- ✅ **File Validation**: Size, type, and duration checks
- ✅ **Metadata**: Automatic metadata creation
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Pinata Integration**: Direct upload to Pinata IPFS

### 4. Usage

```typescript
import { useBattleVideoUpload } from '@/hooks';

const { uploadBattleVideo, isUploading, uploadProgress, error } = useBattleVideoUpload();

// Upload a video for battle
const result = await uploadBattleVideo(file, 'dancing', 'My Dance Battle');
// Returns: { videoHash, videoUrl, metadataHash }
```

### 5. Video Requirements

- **Duration**: Maximum 15 seconds
- **Size**: Under 50MB
- **Formats**: MP4, WebM, MOV, AVI
- **Quality**: 720p recommended

### 6. IPFS URLs

Videos are accessible at:
- **Pinata Gateway**: `https://gateway.pinata.cloud/ipfs/{hash}`
- **Public Gateway**: `https://ipfs.io/ipfs/{hash}`
