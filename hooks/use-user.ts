import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CLIPCLASH_CONTRACT_ABI } from './contractAbi';
import { CLIPCLASH_CONTRACT_ADDRESS } from './contractAddress';

// Types
export interface UserProfile {
  username: string;
  reputation: bigint;
  totalBattles: bigint;
  totalWins: bigint;
  points: bigint;
  isRegistered: boolean;
}

export interface UserRank {
  rankByPoints: bigint;
  rankByReputation: bigint;
}

// Hook for user registration and profile management
export function useUser() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user profile
  const { data: userProfile, refetch: refetchProfile, isLoading: isProfileLoading, error: profileError } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Debug logging
  useEffect(() => {
    console.log('User Profile Debug:', {
      address,
      userProfile: userProfile ? {
        username: userProfile[0],
        reputation: userProfile[1]?.toString(),
        totalBattles: userProfile[2]?.toString(),
        totalWins: userProfile[3]?.toString(),
        points: userProfile[4]?.toString(),
        isRegistered: userProfile[5]
      } : null,
      isProfileLoading,
      profileError,
      isRegistered: userProfile?.[5] // isRegistered is the 6th element (index 5)
    });
  }, [address, userProfile, isProfileLoading, profileError]);

  // Get user points
  const { data: userPoints } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'userPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get user ranks
  const { data: userRankByPoints } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserRankByPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: userRankByReputation } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserRankByReputation',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Register user
  const { writeContract: registerUser, isPending: isRegistering } = useWriteContract({
    mutation: {
      onSuccess: async () => {
        // Wait a bit for blockchain state to update
        setTimeout(() => {
          refetchProfile();
        }, 2000);
        setIsLoading(false);
      },
      onError: (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    },
  });

  // Update username
  const { writeContract: updateUsername, isPending: isUpdating } = useWriteContract({
    mutation: {
      onSuccess: () => {
        refetchProfile();
        setIsLoading(false);
      },
      onError: (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    },
  });

  // Functions
  const register = async (username: string) => {
    if (!address) {
      setError('No wallet connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      registerUser({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'registerUser',
        args: [username],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsLoading(false);
    }
  };

  const updateUser = async (newUsername: string) => {
    if (!address) {
      setError('No wallet connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      updateUsername({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'updateUsername',
        args: [newUsername],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      setIsLoading(false);
    }
  };

  const getAddressByUsername = async (username: string) => {
    // This would need to be implemented as a separate hook or utility function
    // since it's a read function that doesn't require the user's address
    return null;
  };

  // Convert raw contract data to UserProfile interface
  const processedUserProfile: UserProfile | undefined = userProfile ? {
    username: userProfile[0] || '',
    reputation: userProfile[1] || BigInt(0),
    totalBattles: userProfile[2] || BigInt(0),
    totalWins: userProfile[3] || BigInt(0),
    points: userProfile[4] || BigInt(0),
    // Check both the isRegistered field and if username is not empty
    isRegistered: Boolean(userProfile[5]) || Boolean(userProfile[0] && userProfile[0] !== ''),
  } : undefined;

  return {
    // Data
    userProfile: processedUserProfile,
    userPoints,
    userRank: {
      byPoints: userRankByPoints,
      byReputation: userRankByReputation,
    },
    
    // Loading states
    isLoading: isLoading || isRegistering || isUpdating || isProfileLoading,
    isRegistering,
    isUpdating,
    
    // Error
    error: error || (profileError ? profileError.message : null),
    
    // Functions
    register,
    updateUser,
    getAddressByUsername,
    refetchProfile,
  };
}

// Hook for checking if username is available
export function useUsernameAvailability() {
  const { data: addressByUsername } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'usernameToAddress',
    args: undefined, // This will be set when the hook is called with a username
  });

  const checkUsername = async (username: string) => {
    // This would need to be implemented with a contract read
    // For now, return a placeholder
    return addressByUsername === '0x0000000000000000000000000000000000000000';
  };

  return {
    checkUsername,
    addressByUsername,
  };
}

