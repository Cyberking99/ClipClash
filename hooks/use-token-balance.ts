import { useReadContract } from 'wagmi';
import { CLIP_TOKEN_ADDRESS } from './contractAddress';

// ERC20 ABI for balance reading
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "type": "function"
  }
] as const;

// Hook for getting CLIP token balance
export function useTokenBalance(userAddress?: string) {
  const { data: balance, isLoading: isBalanceLoading, error: balanceError, refetch: refetchBalance } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const { data: decimals, isLoading: isDecimalsLoading } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: name, isLoading: isNameLoading } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'name',
  });

  // Format balance with proper decimals
  const formattedBalance = balance && decimals ? 
    (Number(balance) / Math.pow(10, Number(decimals))).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }) : '0';

  return {
    balance: formattedBalance,
    rawBalance: balance,
    decimals,
    symbol,
    name,
    isLoading: isBalanceLoading || isDecimalsLoading || isSymbolLoading || isNameLoading,
    error: balanceError,
    refetchBalance,
  };
}

// Hook for getting token info
export function useTokenInfo() {
  const { data: decimals, isLoading: isDecimalsLoading } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: name, isLoading: isNameLoading } = useReadContract({
    address: CLIP_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'name',
  });

  return {
    decimals,
    symbol,
    name,
    isLoading: isDecimalsLoading || isSymbolLoading || isNameLoading,
  };
}
