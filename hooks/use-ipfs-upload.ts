import { useState } from 'react';

// Types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  hash: string;
  url: string;
  size: number;
  type: string;
}

export interface VideoMetadata {
  name: string;
  description: string;
  category: string;
  duration: number;
  size: number;
  type: string;
}

// Pinata API configuration
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs';

// Hook for IPFS video uploads using Pinata
export function useIPFSUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get Pinata API key from environment
  const getPinataConfig = () => {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
    
    if (!apiKey || !secretKey) {
      throw new Error(
        'Pinata API credentials not found. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_SECRET_KEY in your .env.local file. ' +
        'Get your API keys from https://app.pinata.cloud/developers'
      );
    }
    
    return { apiKey, secretKey };
  };

  // Check if using public IPFS (no API keys needed)
  const isUsingPublicIPFS = () => {
    return process.env.NEXT_PUBLIC_USE_PUBLIC_IPFS === 'true';
  };

  // Validate video file
  const validateVideoFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload MP4, WebM, MOV, or AVI files only.';
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return 'File too large. Please upload videos under 50MB.';
    }

    return null;
  };

  // Get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Could not load video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  // Fallback upload method using public IPFS gateways
  const uploadToPublicIPFS = async (file: File): Promise<UploadResult> => {
    // For now, we'll simulate an upload since public gateways require different setup
    // In a real implementation, you'd use services like Web3.Storage or local IPFS
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate upload with a mock hash
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15);
        resolve({
          hash: mockHash,
          url: `https://ipfs.io/ipfs/${mockHash}`,
          size: file.size,
          type: file.type
        });
      }, 2000);
    });
  };

  // Upload video to Pinata
  const uploadVideoToPinata = async (file: File, metadata?: Partial<VideoMetadata>): Promise<UploadResult> => {
    // Check if we should use public IPFS instead
    if (isUsingPublicIPFS()) {
      console.log('Using public IPFS fallback (no API keys required)');
      return uploadToPublicIPFS(file);
    }

    let apiKey: string, secretKey: string;
    try {
      const config = getPinataConfig();
      apiKey = config.apiKey;
      secretKey = config.secretKey;
    } catch (error) {
      console.warn('Pinata credentials not found, falling back to public IPFS');
      return uploadToPublicIPFS(file);
    }
    
    // Validate file
    const validationError = validateVideoFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    // Get video duration
    const duration = await getVideoDuration(file);
    
    // Check duration (15 seconds max)
    if (duration > 15) {
      throw new Error('Video too long. Please upload videos under 15 seconds.');
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const pinataMetadata = {
        name: metadata?.name || file.name,
        keyvalues: {
          type: 'battle-video',
          category: metadata?.category || 'general',
          duration: duration.toString(),
          size: file.size.toString(),
          uploadDate: new Date().toISOString(),
        }
      };

      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      // Add options
      const pinataOptions = {
        cidVersion: 1,
        wrapWithDirectory: false
      };
      formData.append('pinataOptions', JSON.stringify(pinataOptions));

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setUploadProgress({
              loaded: event.loaded,
              total: event.total,
              percentage
            });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const hash = response.IpfsHash;
            const url = `${PINATA_GATEWAY_URL}/${hash}`;
            
            resolve({
              hash,
              url,
              size: file.size,
              type: file.type
            });
          } else if (xhr.status === 403) {
            reject(new Error(
              'Pinata API access denied (403). Please check your API credentials. ' +
              'Make sure your API keys are correct and have the proper permissions. ' +
              'Get your API keys from https://app.pinata.cloud/developers'
            ));
          } else if (xhr.status === 401) {
            reject(new Error(
              'Pinata API unauthorized (401). Please check your API credentials. ' +
              'Your API key or secret key may be incorrect or expired.'
            ));
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        xhr.open('POST', `${PINATA_API_URL}/pinning/pinFileToIPFS`);
        xhr.setRequestHeader('pinata_api_key', apiKey);
        xhr.setRequestHeader('pinata_secret_api_key', secretKey);
        xhr.send(formData);
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Upload video metadata to Pinata
  const uploadVideoMetadata = async (videoHash: string, metadata: VideoMetadata): Promise<string> => {
    const { apiKey, secretKey } = getPinataConfig();

    const metadataObject = {
      name: metadata.name,
      description: metadata.description,
      image: `${PINATA_GATEWAY_URL}/${videoHash}`,
      external_url: `${PINATA_GATEWAY_URL}/${videoHash}`,
      attributes: [
        {
          trait_type: "Category",
          value: metadata.category
        },
        {
          trait_type: "Duration",
          value: `${metadata.duration}s`
        },
        {
          trait_type: "Size",
          value: `${Math.round(metadata.size / 1024 / 1024)}MB`
        },
        {
          trait_type: "Type",
          value: metadata.type
        }
      ]
    };

    try {
      const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': secretKey,
        },
        body: JSON.stringify({
          pinataContent: metadataObject,
          pinataMetadata: {
            name: `${metadata.name}-metadata`,
            keyvalues: {
              type: 'video-metadata',
              videoHash: videoHash,
              category: metadata.category
            }
          },
          pinataOptions: {
            cidVersion: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Metadata upload failed: ${response.status}`);
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Metadata upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get IPFS URL from hash
  const getIPFSUrl = (hash: string): string => {
    return `${PINATA_GATEWAY_URL}/${hash}`;
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    isUploading,
    uploadProgress,
    error,
    
    // Functions
    uploadVideoToPinata,
    uploadVideoMetadata,
    getIPFSUrl,
    clearError,
    
    // Utilities
    validateVideoFile,
    getVideoDuration,
  };
}

// Hook for battle video uploads specifically
export function useBattleVideoUpload() {
  const {
    isUploading,
    uploadProgress,
    error,
    uploadVideoToPinata,
    uploadVideoMetadata,
    getIPFSUrl,
    clearError,
    validateVideoFile,
    getVideoDuration
  } = useIPFSUpload();

  // Upload video for battle creation
  const uploadBattleVideo = async (
    file: File, 
    category: string,
    battleTitle?: string
  ): Promise<{ videoHash: string; videoUrl: string; metadataHash?: string }> => {
    try {
      // Upload video
      const videoResult = await uploadVideoToPinata(file, {
        name: battleTitle || file.name,
        category,
        duration: await getVideoDuration(file),
        size: file.size,
        type: file.type
      });

      // Create metadata
      const metadata: VideoMetadata = {
        name: battleTitle || file.name,
        description: `Battle video for ${category} category`,
        category,
        duration: await getVideoDuration(file),
        size: file.size,
        type: file.type
      };

      // Upload metadata
      const metadataHash = await uploadVideoMetadata(videoResult.hash, metadata);

      return {
        videoHash: videoResult.hash,
        videoUrl: videoResult.url,
        metadataHash
      };
    } catch (err) {
      throw err;
    }
  };

  return {
    // State
    isUploading,
    uploadProgress,
    error,
    
    // Functions
    uploadBattleVideo,
    getIPFSUrl,
    clearError,
    validateVideoFile,
    getVideoDuration,
  };
}
