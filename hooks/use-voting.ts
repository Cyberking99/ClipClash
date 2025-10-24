import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CLIPCLASH_CONTRACT_ABI } from './contractAbi';
import { CLIPCLASH_CONTRACT_ADDRESS } from './contractAddress';

// Types
export interface VoteParams {
  battleId: bigint;
  creator: string;
  amount: bigint;
}

// Hook for voting functionality
export function useVoting() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vote function
  const { writeContract: vote, isPending: isVoting } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    },
  });

  // Functions
  const castVote = async (params: VoteParams) => {
    if (!address) {
      setError('No wallet connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      vote({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'vote',
        args: [params.battleId, params.creator as `0x${string}`, params.amount],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voting failed');
      setIsLoading(false);
    }
  };

  return {
    // Loading states
    isLoading: isLoading || isVoting,
    isVoting,
    
    // Error
    error,
    
    // Functions
    castVote,
  };
}

// Hook for getting votes per battle
export function useVotesPerBattle(battleId: bigint, voter: string) {
  const { data: votes, refetch: refetchVotes } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'votesPerBattle',
    args: [battleId, voter as `0x${string}`],
  });

  return {
    votes,
    refetchVotes,
  };
}

// Hook for getting battle vote counts
export function useBattleVotes(battleId: bigint) {
  const { data: battle, refetch: refetchBattle } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'battles',
    args: [battleId],
  });

  return {
    votes1: battle?.[8] || BigInt(0),
    votes2: battle?.[9] || BigInt(0),
    refetchBattle,
  };
}

