// Contract addresses and ABI
export { CLIPCLASH_CONTRACT_ADDRESS, CLIP_TOKEN_ADDRESS } from './contractAddress';
export { CLIPCLASH_CONTRACT_ABI } from './contractAbi';

// User management hooks
export { useUser, useUsernameAvailability } from './use-user';
export type { UserProfile, UserRank } from './use-user';

// Battle management hooks
export { useBattle, useBattleData, useBattlesList, getBattleStatus, getTimeRemaining, formatTimeRemaining } from './use-battle';
export type { Battle, BattleCreationParams, BattleJoinParams } from './use-battle';

// Voting hooks
export { useVoting, useVotesPerBattle, useBattleVotes } from './use-voting';
export type { VoteParams } from './use-voting';

// Leaderboard hooks
export { useLeaderboard, useLeaderboardAddresses, useLeaderboardStatus } from './use-leaderboard';
export type { 
  LeaderboardUser, 
  TopUsersByPoints, 
  TopUsersByReputation, 
  TopUsersByWins 
} from './use-leaderboard';

// Contract constants and utility hooks
export { useContractConstants, useContractInfo, useUserPoints, useUserProfile } from './use-contract-constants';

// IPFS upload hooks
export { useIPFSUpload, useBattleVideoUpload } from './use-ipfs-upload';

// Token balance hooks
export { useTokenBalance, useTokenInfo } from './use-token-balance';


// Existing hooks
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';

