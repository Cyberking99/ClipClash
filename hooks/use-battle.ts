import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { decodeEventLog, parseUnits } from 'viem';
import { CLIPCLASH_CONTRACT_ADDRESS, CLIP_TOKEN_ADDRESS } from './contractAddress';
import { CLIPCLASH_CONTRACT_ABI } from './contractAbi';

// ERC20 ABI for token approval
const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Types
export interface Battle {
  battleId: bigint;
  creator1: string;
  creator2: string;
  ipfsHash1: string;
  ipfsHash2: string;
  category: string;
  entryFee: bigint;
  votingEndTime: bigint;
  votes1: bigint;
  votes2: bigint;
  winner: string;
  isActive: boolean;
}

export interface BattleCreationParams {
  category: string;
  entryFee: bigint;
  ipfsHash1: string;
}

export interface BattleJoinParams {
  battleId: bigint;
  ipfsHash2: string;
}

export type BattleCreationStep = 
  | 'idle'
  | 'checking-registration'
  | 'checking-allowance'
  | 'approving-tokens'
  | 'creating-battle'
  | 'waiting-confirmation'
  | 'success'
  | 'error';

// Hook for battle management
export function useBattle() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [currentStep, setCurrentStep] = useState<BattleCreationStep>('idle');
  const [error, setError] = useState<string | null>(null);

  // Get total battle count
  const { data: battleCount, refetch: refetchBattleCount } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'battleCount',
  });

  // Get creator battles count
  const { data: creatorBattles } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'creatorBattles',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Note: Registration check is handled in the upload page using useUser hook

  // Check token allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address as `0x${string}`, CLIPCLASH_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Token approval
  const { writeContractAsync: approveAsync } = useWriteContract();

  // Create battle
  const { writeContractAsync: createBattleAsync } = useWriteContract();

  // Join battle
  const { writeContractAsync: joinBattleAsync } = useWriteContract();

  // End battle
  const { writeContractAsync: endBattleAsync } = useWriteContract();

  // Vote on battle
  const { writeContractAsync: voteAsync } = useWriteContract();

  // Create battle with full flow (approval + creation)
  const createNewBattle = async (params: BattleCreationParams): Promise<string> => {
    if (!address) {
      const err = 'No wallet connected';
      setError(err);
      throw new Error(err);
    }

    if (!publicClient) {
      const err = 'Public client not available';
      setError(err);
      throw new Error(err);
    }
    
    setError(null);
    
    try {
       // Step 1: Check allowance
      setCurrentStep('checking-allowance');
      const requiredAmount = params.entryFee;
      const allowance = (currentAllowance as bigint) || BigInt(0);
      
      console.log('Current allowance:', allowance.toString());
      console.log('Required amount:', requiredAmount.toString());

       // Step 2: Approve tokens if needed
      if (allowance < requiredAmount) {
        setCurrentStep('approving-tokens');
        console.log('Approving tokens...');
        
        const approveHash = await approveAsync({
          address: CLIP_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CLIPCLASH_CONTRACT_ADDRESS, requiredAmount],
        });

        console.log('Approval tx:', approveHash);
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        console.log('Approval confirmed');
        
        // Refetch allowance to ensure it's updated
        await refetchAllowance();
      }

       // Step 3: Create battle
      setCurrentStep('creating-battle');
      console.log('Creating battle with params:', params);
      
      const hash = await createBattleAsync({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'createBattle',
        args: [params.category, params.entryFee, params.ipfsHash1],
      });

      console.log('Battle creation tx:', hash);

       // Step 4: Wait for confirmation
      setCurrentStep('waiting-confirmation');
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Battle created, receipt:', receipt);

       // Step 5: Extract battleId from event
      let battleId = hash; // Fallback to tx hash
      
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: CLIPCLASH_CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
          }) as any;
          
          if (decoded?.eventName === 'BattleCreated') {
            battleId = decoded.args.battleId.toString();
            console.log('Extracted battleId:', battleId);
            break;
          }
        } catch (_) {
          // Not the right log
        }
      }

      setCurrentStep('success');
      await refetchBattleCount();
      
      return battleId;
      
    } catch (err: any) {
      setCurrentStep('error');
      
      // Parse error message for better UX
      let errorMessage = 'Battle creation failed';
      
      if (err.message) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction rejected by user';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient CLASH tokens in wallet';
        } else if (err.message.includes('Entry fee too low')) {
          errorMessage = 'Entry fee is below minimum (10 CLASH)';
        } else if (err.message.includes('User not registered')) {
          errorMessage = 'Please complete registration first';
        } else if (err.message.includes('exceeds allowance')) {
          errorMessage = 'Token approval failed. Please try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const joinExistingBattle = async (params: BattleJoinParams) => {
    if (!address) {
      const err = 'No wallet connected';
      setError(err);
      throw new Error(err);
    }

    if (!publicClient) {
      const err = 'Public client not available';
      setError(err);
      throw new Error(err);
    }
    
     setCurrentStep('creating-battle');
    setError(null);
    
    try {
      const hash = await joinBattleAsync({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'joinBattle',
        args: [params.battleId, params.ipfsHash2],
      });

      setCurrentStep('waiting-confirmation');
      await publicClient.waitForTransactionReceipt({ hash });
      
      setCurrentStep('success');
      await refetchBattleCount();
      
    } catch (err: any) {
      setCurrentStep('error');
      const errorMessage = err.message || 'Failed to join battle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const endExistingBattle = async (battleId: bigint) => {
    if (!address) {
      const err = 'No wallet connected';
      setError(err);
      throw new Error(err);
    }

    if (!publicClient) {
      const err = 'Public client not available';
      setError(err);
      throw new Error(err);
    }
    
    setCurrentStep('waiting-confirmation');
    setError(null);
    
    try {
      const hash = await endBattleAsync({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'endBattle',
        args: [battleId],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      
      setCurrentStep('success');
      await refetchBattleCount();
      
    } catch (err: any) {
      setCurrentStep('error');
      const errorMessage = err.message || 'Failed to end battle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const voteOnBattle = async (battleId: bigint, creator: string, amount: bigint) => {
    if (!address) {
      const err = 'No wallet connected';
      setError(err);
      throw new Error(err);
    }

    if (!publicClient) {
      const err = 'Public client not available';
      setError(err);
      throw new Error(err);
    }
    
    setCurrentStep('waiting-confirmation');
    setError(null);
    
    try {
      const hash = await voteAsync({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'vote',
        args: [battleId, creator as `0x${string}`, amount],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      
      setCurrentStep('success');
      await refetchBattleCount();
      
    } catch (err: any) {
      setCurrentStep('error');
      const errorMessage = err.message || 'Failed to vote on battle';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetState = () => {
    setCurrentStep('idle');
    setError(null);
  };

  return {
     // Data
     battleCount,
     creatorBattles,
     currentAllowance,
    
    // State
    currentStep,
    isCreating: currentStep !== 'idle' && currentStep !== 'success' && currentStep !== 'error',
    isApproving: currentStep === 'approving-tokens',
    isWaitingConfirmation: currentStep === 'waiting-confirmation',
    
    // Error
    error,
    
    // Functions
    createNewBattle,
    joinExistingBattle,
    endExistingBattle,
    voteOnBattle,
    resetState,
    refetchBattleCount,
    refetchAllowance,
  };
}

// Hook for getting specific battle data
export function useBattleData(battleId: bigint) {
  const { data: rawData, refetch: refetchBattle } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'battles',
    args: [battleId],
  });

  // Transform the raw data into our Battle interface
  const battle: Battle | undefined = rawData ? {
    battleId: rawData[0],
    creator1: rawData[1],
    creator2: rawData[2],
    ipfsHash1: rawData[3],
    ipfsHash2: rawData[4],
    category: rawData[5],
    entryFee: rawData[6],
    votingEndTime: rawData[7],
    votes1: rawData[8],
    votes2: rawData[9],
    winner: rawData[10],
    isActive: rawData[11],
  } : undefined;

  return {
    battle,
    refetchBattle,
  };
}

// Hook for fetching multiple battles using individual contract reads
export function useBattlesList(limit: number = 20) {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  // Get total battle count
  const { data: battleCount, refetch: refetchBattleCount } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'battleCount',
  });


  const fetchBattles = async () => {
    if (!battleCount) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const totalBattles = Number(battleCount);
      const battlePromises = [];
      
      // Fetch battles in reverse order (newest first)
      // Battle IDs start from 1, not 0
      for (let i = totalBattles; i >= 1; i--) {
        battlePromises.push(fetchBattleById(i));
      }
      
      const results = await Promise.all(battlePromises);
      const validBattles = results.filter((battle): battle is Battle => battle !== null);
      
      setBattles(validBattles);
    } catch (err) {
      console.error('Error fetching battles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch battles');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBattleById = async (battleId: number): Promise<Battle | null> => {
    try {
      if (!publicClient) {
        console.error('Public client not available');
        return null;
      }

      // Read battle data from contract using the ABI
      const battleData = await publicClient.readContract({
        address: CLIPCLASH_CONTRACT_ADDRESS,
        abi: CLIPCLASH_CONTRACT_ABI,
        functionName: 'battles',
        args: [BigInt(battleId)],
      });

      // Check if battle exists (has non-zero battleId)
      if (!battleData || battleData[0] === BigInt(0)) {
        return null;
      }

      // Transform the raw data into our Battle interface
      const battle: Battle = {
        battleId: battleData[0],
        creator1: battleData[1],
        creator2: battleData[2],
        ipfsHash1: battleData[3],
        ipfsHash2: battleData[4],
        category: battleData[5],
        entryFee: battleData[6],
        votingEndTime: battleData[7],
        votes1: battleData[8],
        votes2: battleData[9],
        winner: battleData[10],
        isActive: battleData[11],
      };

      return battle;
    } catch (err) {
      console.error(`Failed to fetch battle ${battleId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    if (battleCount) {
      fetchBattles();
    }
  }, [battleCount, limit]);


  const refetch = () => {
    refetchBattleCount();
    fetchBattles();
  };

  return {
    battles,
    isLoading,
    error,
    refetch,
    totalBattles: battleCount,
  };
}

// Utility function to determine battle status
export function getBattleStatus(battle: Battle): 'live' | 'upcoming' | 'completed' {
  if (!battle.isActive) return 'completed';
  
  // Check if battle has time remaining
  const now = Math.floor(Date.now() / 1000);
  const endTime = Number(battle.votingEndTime);
  
  console.log('Battle status check:', {
    battleId: battle.battleId.toString(),
    isActive: battle.isActive,
    now,
    endTime,
    timeRemaining: endTime - now
  });
  
  if (endTime > now) {
    return 'live'; // Battle is active and has time remaining
  } else {
    return 'completed'; // Battle time has ended
  }
}

// Utility function to calculate time remaining
export function getTimeRemaining(battle: Battle): number | null {
  const now = Math.floor(Date.now() / 1000);
  const endTime = Number(battle.votingEndTime);
  return Math.max(0, endTime - now);
}

// Utility function to format time remaining
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Ended';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}