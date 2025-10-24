import { useReadContract } from 'wagmi';
import { CLIPCLASH_CONTRACT_ABI } from './contractAbi';
import { CLIPCLASH_CONTRACT_ADDRESS } from './contractAddress';

// Hook for getting contract constants
export function useContractConstants() {
  // Get all contract constants
  const { data: creatorRewardPercent } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'CREATOR_REWARD_PERCENT',
  });

  const { data: minEntryFee } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'MIN_ENTRY_FEE',
  });

  const { data: pointsPerBattle } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'POINTS_PER_BATTLE',
  });

  const { data: pointsPerVote } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'POINTS_PER_VOTE',
  });

  const { data: pointsPerWin } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'POINTS_PER_WIN',
  });

  const { data: protocolFeePercent } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'PROTOCOL_FEE_PERCENT',
  });

  const { data: voterRewardPercent } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'VOTER_REWARD_PERCENT',
  });

  const { data: votingDuration } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'VOTING_DURATION',
  });

  return {
    creatorRewardPercent,
    minEntryFee,
    pointsPerBattle,
    pointsPerVote,
    pointsPerWin,
    protocolFeePercent,
    voterRewardPercent,
    votingDuration,
  };
}

// Hook for getting contract info
export function useContractInfo() {
  const { data: clashToken } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'clashToken',
  });

  const { data: treasury } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'treasury',
  });

  const { data: owner } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'owner',
  });

  return {
    clashToken,
    treasury,
    owner,
  };
}

// Hook for getting user points
export function useUserPoints(userAddress: string) {
  const { data: userPoints, refetch: refetchUserPoints } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'userPoints',
    args: [userAddress as `0x${string}`],
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    userPoints,
    refetchUserPoints,
  };
}

// Hook for getting user profile (simplified version)
export function useUserProfile(userAddress: string) {
  const { data: userProfile, refetch: refetchUserProfile } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'userProfiles',
    args: [userAddress as `0x${string}`],
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    userProfile,
    refetchUserProfile,
  };
}

