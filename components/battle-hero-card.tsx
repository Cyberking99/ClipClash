"use client"

import { IPFSVideoPlayer } from "@/components/ipfs-video-player"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Vote, Users, Clock, Trophy, Share2 } from "lucide-react"
import { Battle } from "@/hooks"
import { getBattleStatus, formatTimeRemaining } from "@/hooks"
import { useReadContract } from "wagmi"
import { CLIPCLASH_CONTRACT_ADDRESS } from "@/hooks/contractAddress"
import { CLIPCLASH_CONTRACT_ABI } from "@/hooks/contractAbi"

export type BattleHeroCardProps = {
  battle: Battle
  isUserBattle?: boolean
  onVote?: (creator: string) => void
  onJoin?: () => void
  onPlay?: () => void
  onShare?: () => void
}

export function BattleHeroCard({ 
  battle, 
  isUserBattle = false, 
  onVote, 
  onJoin, 
  onPlay,
  onShare
}: BattleHeroCardProps) {
  const status = getBattleStatus(battle)
  const leftVotes = Number(battle.votes1)
  const rightVotes = Number(battle.votes2)
  const totalVotes = Math.max(leftVotes + rightVotes, 1)
  const leftPct = Math.round((leftVotes / totalVotes) * 100)
  const rightPct = 100 - leftPct

  const entryFeeFormatted = Number(battle.entryFee) / 1e18
  const prizePool = entryFeeFormatted * 2

  // Get creator profiles
  const { data: creator1Profile } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: [battle.creator1 as `0x${string}`],
  });

  const { data: creator2Profile } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: battle.creator2 !== "0x0000000000000000000000000000000000000000" ? [battle.creator2 as `0x${string}`] : undefined,
    query: {
      enabled: battle.creator2 !== "0x0000000000000000000000000000000000000000",
    },
  });

  const creator1Name = creator1Profile?.[0] || "Creator1"
  const creator2Name = battle.creator2 === "0x0000000000000000000000000000000000000000" 
    ? "Waiting for challenger" 
    : creator2Profile?.[0] || "Creator2"

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile-First Layout */}
      <div className="space-y-4 md:space-y-6">
        
        {/* Battle Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="capitalize text-xs sm:text-sm">
              {battle.category}
            </Badge>
            <Badge className={
              status === "live" ? "bg-red-500 text-white" : 
              status === "upcoming" ? "bg-blue-500 text-white" : 
              "bg-green-600 text-white"
            }>
              {status === "live" ? "Live" : status === "upcoming" ? "Upcoming" : "Completed"}
            </Badge>
            {isUserBattle && (
              <Badge variant="secondary" className="text-xs">
                Your Battle
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {status === "live" || status === "upcoming" 
                ? formatTimeRemaining(Number(battle.votingEndTime) - Math.floor(Date.now() / 1000))
                : "Ended"
              }
            </span>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
          {battle.ipfsHash1 ? (
            <>
              <IPFSVideoPlayer
                ipfsHash={battle.ipfsHash1}
                className="w-full h-full"
                controls={false}
                muted
                poster={`https://gateway.pinata.cloud/ipfs/${battle.ipfsHash1}`}
              />
              <button 
                onClick={onPlay}
                className="absolute inset-0 bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
              >
                <div className="size-12 sm:size-16 grid place-items-center rounded-full border bg-background/70">
                  <Play className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </button>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{battle.category.charAt(0).toUpperCase()}</span>
            </div>
          )}
          
          {/* Video Overlay Info */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-black/70 text-white text-xs p-2 rounded">
              <p className="font-bold">{creator1Name} vs {creator2Name}</p>
              <p>{battle.category} • {totalVotes} votes • {prizePool.toFixed(0)} $CLASH prize</p>
            </div>
          </div>
        </div>

        {/* Contestants Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Creator 1 */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="relative size-12 sm:size-16 overflow-hidden rounded-md border bg-muted">
              {battle.ipfsHash1 ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                  <span className="text-white font-bold text-lg">{creator1Name.charAt(0)}</span>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{creator1Name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block rounded-sm px-2 py-1 text-sm font-extrabold tracking-wide bg-black text-amber-400">
                {creator1Name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">@{creator1Name.toLowerCase()}</div>
              <div className="text-xs text-muted-foreground mt-1">{leftVotes} votes ({leftPct}%)</div>
            </div>
            {status === "live" && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onVote?.(battle.creator1)}
                className="gap-1 text-xs"
              >
                <Vote className="h-3 w-3" />
                Vote
              </Button>
            )}
          </div>

          {/* Creator 2 */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="relative size-12 sm:size-16 overflow-hidden rounded-md border bg-muted">
              {battle.ipfsHash2 ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                  <span className="text-white font-bold text-lg">{creator2Name.charAt(0)}</span>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{creator2Name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block rounded-sm px-2 py-1 text-sm font-extrabold tracking-wide bg-black text-amber-400">
                {creator2Name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {battle.creator2 === "0x0000000000000000000000000000000000000000" 
                  ? "Waiting..." 
                  : `@${creator2Name.toLowerCase()}`
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {battle.creator2 === "0x0000000000000000000000000000000000000000" 
                  ? "No votes yet" 
                  : `${rightVotes} votes (${rightPct}%)`
                }
              </div>
            </div>
            {status === "live" && battle.creator2 !== "0x0000000000000000000000000000000000000000" && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onVote?.(battle.creator2)}
                className="gap-1 text-xs"
              >
                <Vote className="h-3 w-3" />
                Vote
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-muted relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-[#1f4140]" style={{ width: `${leftPct}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{leftPct}%</span>
            <span>{rightPct}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {status === "live" && battle.creator2 === "0x0000000000000000000000000000000000000000" && onJoin && (
            <Button 
              className="bg-[#1f4140] text-white hover:bg-[#183736] gap-2"
              onClick={onJoin}
            >
              <Users className="h-4 w-4" />
              Join Battle
            </Button>
          )}
          {status === "upcoming" && (
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Set Reminder
            </Button>
          )}
          {status === "completed" && (
            <Button variant="outline" className="gap-2">
              <Trophy className="h-4 w-4" />
              View Results
            </Button>
          )}
          <Button variant="outline" className="gap-2" onClick={onPlay}>
            <Play className="h-4 w-4" />
            Watch 15s Preview
          </Button>
          {onShare && (
            <Button variant="outline" className="gap-2" onClick={onShare}>
              <Share2 className="h-4 w-4" />
              Share Battle
            </Button>
          )}
        </div>

        {/* Battle Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg border bg-card">
            <div className="text-xs text-muted-foreground">Entry Fee</div>
            <div className="text-sm font-semibold">{entryFeeFormatted} $CLASH</div>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <div className="text-xs text-muted-foreground">Prize Pool</div>
            <div className="text-sm font-semibold">{prizePool.toFixed(0)} $CLASH</div>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <div className="text-xs text-muted-foreground">Total Votes</div>
            <div className="text-sm font-semibold">{totalVotes}</div>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <div className="text-xs text-muted-foreground">Battle ID</div>
            <div className="text-sm font-semibold">#{battle.battleId.toString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
