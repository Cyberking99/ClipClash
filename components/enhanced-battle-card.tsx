"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatTimeRemaining, getBattleStatus, useBattle } from "@/hooks"
import { Play, Clock, Trophy, Users, Vote, UserPlus } from "lucide-react"
import { useReadContract } from "wagmi"
import { CLIPCLASH_CONTRACT_ADDRESS } from "@/hooks/contractAddress"
import { CLIPCLASH_CONTRACT_ABI } from "@/hooks/contractAbi"
import { VoteModal } from "@/components/vote-modal"

import { Battle } from "@/hooks"

export type EnhancedBattleCardProps = {
  battle: Battle
  onJoin?: () => void
}

export function EnhancedBattleCard({ battle, onJoin }: EnhancedBattleCardProps) {
  const [open, setOpen] = useState<false | "left" | "right">(false)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<{ address: string; name: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { voteOnBattle, joinExistingBattle, isCreating } = useBattle()

  // Get creator1 profile
  const { data: creator1Profile } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: [battle.creator1 as `0x${string}`],
  });

  // Get creator2 profile (if exists)
  const { data: creator2Profile } = useReadContract({
    address: CLIPCLASH_CONTRACT_ADDRESS,
    abi: CLIPCLASH_CONTRACT_ABI,
    functionName: 'getUserProfile',
    args: battle.creator2 !== "0x0000000000000000000000000000000000000000" ? [battle.creator2 as `0x${string}`] : undefined,
    query: {
      enabled: battle.creator2 !== "0x0000000000000000000000000000000000000000",
    },
  });

  const status = getBattleStatus(battle)
  const leftVotes = Number(battle.votes1)
  const rightVotes = Number(battle.votes2)
  const total = Math.max(leftVotes + rightVotes, 1)
  const leftPct = Math.round((leftVotes / total) * 100)
  const rightPct = 100 - leftPct

  const creator1Name = creator1Profile?.[0] || "Creator1"
  const creator2Name = battle.creator2 === "0x0000000000000000000000000000000000000000" 
    ? "Waiting for challenger" 
    : creator2Profile?.[0] || "Creator2"
  
  const entryFeeFormatted = Number(battle.entryFee) / 1e18
  const prizePool = entryFeeFormatted * 2 // 2x entry fee

  const handleVote = (creatorAddress: string, creatorName: string) => {
    setSelectedCreator({ address: creatorAddress, name: creatorName })
    setShowVoteModal(true)
  }

  const handleJoinBattle = async () => {
    if (onJoin) {
      onJoin()
    } else {
      try {
        await joinExistingBattle({
          battleId: battle.battleId,
          ipfsHash2: "bafybeice35t3mzo7yqbzwbq3vsw3cfm6lx7s4fbua33b2pknl5e5mk77ga" // TODO: Get from user upload
        })
      } catch (error) {
        console.error('Join battle failed:', error)
      }
    }
  }

  useEffect(() => {
    if (!open) return
    const el = videoRef.current
    const handleEnded = () => {
      if (open === "left") setOpen("right")
      else setOpen(false)
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    if (el) {
      try { el.currentTime = 0 } catch {}
      el.play().catch(() => {})
      timer = setTimeout(handleEnded, 15000)
      el.addEventListener("ended", handleEnded)
    }
    return () => {
      if (timer) clearTimeout(timer)
      if (el) el.removeEventListener("ended", handleEnded)
      if (el) el.pause()
    }
  }, [open])

  return (
    <Link href={`/battles/${battle.battleId}`}
      className="rounded-lg border bg-white dark:bg-background p-4 block hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="capitalize">{battle.category}</Badge>
        <Badge className={
          status === "live" ? "bg-red-500" : 
          status === "upcoming" ? "bg-blue-500" : 
          "bg-green-600"
        }>
          {status === "live" ? "Live" : status === "upcoming" ? "Upcoming" : "Completed"}
        </Badge>
      </div>

     
      {/* Contestants */}
      <div className="flex flex-col gap-4">
        <ContestantRow
          side="left"
          name={creator1Name}
          handle={`@${creator1Name.toLowerCase()}`}
          percentage={leftPct}
          votes={leftVotes}
          onPlay={(e) => { e.preventDefault(); setOpen("left") }}
          hasVideo={!!battle.ipfsHash1}
        />
        <ContestantRow
          side="right"
          name={creator2Name}
          handle={battle.creator2 ? `@${creator2Name.toLowerCase()}` : "Waiting..."}
          percentage={rightPct}
          votes={rightVotes}
          onPlay={(e) => { e.preventDefault(); setOpen("right") }}
          hasVideo={!!battle.ipfsHash2}
        />
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-muted relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-[#1f4140]" style={{ width: `${leftPct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{leftPct}%</span>
          <span>{rightPct}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {"endTime" in battle && (battle as any).endTime && Date.now() < new Date((battle as any).endTime).getTime() ? (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeRemaining(
                Math.max(
                  0,
                  Math.floor(
                    (new Date((battle as any).endTime).getTime() - Date.now()) / 1000
                  )
                )
              )}
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" />
              {battle.winner ? `Winner: ${battle.winner}` : "Ended"}
            </Badge>
          )}
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {total} votes
          </Badge>
          <Badge variant="outline">
            Prize: {prizePool.toFixed(0)} $CLASH
          </Badge>
        </div>
        <div className="flex gap-2">
          {status === "live" && (
            <>  
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleVote(battle.creator1, creator1Name)}
                disabled={isCreating}
                className="gap-1"
              >
                <Vote className="h-3 w-3" />
                Vote {creator1Name}
              </Button>
              {battle.creator2 !== "0x0000000000000000000000000000000000000000" && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleVote(battle.creator2, creator2Name)}
                  disabled={isCreating}
                  className="gap-1"
                >
                  <Vote className="h-3 w-3" />
                  Vote {creator2Name}
                </Button>
              )}
              {battle.creator2 === "0x0000000000000000000000000000000000000000" && onJoin && (
                <Button 
                  size="sm" 
                  className="bg-[#1f4140] text-white hover:bg-[#183736] gap-1"
                  onClick={handleJoinBattle}
                  disabled={isCreating}
                >
                  <UserPlus className="h-3 w-3" />
                  Join Battle
                </Button>
              )}
            </>
          )}
          {status === "upcoming" && (
            <Button size="sm" className="bg-[#1f4140] text-white hover:bg-[#183736]">
              Set Reminder
            </Button>
          )}
          {status === "completed" && (
            <Button size="sm" className="bg-[#1f4140] text-white hover:bg-[#183736]">
              View Results
            </Button>
          )}
        </div>
      </div>

      {/* Vote Modal */}
      {selectedCreator && (
        <VoteModal
          open={showVoteModal}
          onOpenChange={setShowVoteModal}
          battleId={battle.battleId}
          creator={selectedCreator.address}
          creatorName={selectedCreator.name}
          onSuccess={() => {
            // Refetch battle data after successful vote
            window.location.reload()
          }}
        />
      )}
    </Link>
  )
}

function ContestantRow({
  side,
  name,
  handle,
  percentage,
  votes,
  onPlay,
  hasVideo,
}: {
  side: "left" | "right"
  name: string
  handle: string
  percentage: number
  votes: number
  onPlay?: (e: React.MouseEvent) => void
  hasVideo: boolean
}) {
  return (
      <div className={`flex items-center ${side === "right" ? "flex-row-reverse" : ""} gap-3`}>
      <div className="relative size-16 md:size-20 overflow-hidden rounded-md border bg-muted">
        {hasVideo ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
            <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Play className="h-4 w-4 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className={`flex-1 ${side === "right" ? "text-right" : ""}`}>
        <div className={`inline-block rounded-sm px-3 py-1 text-sm font-extrabold tracking-wide ${side === "right" ? "ml-auto" : ""} bg-black text-amber-400`}>
          {name}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{handle}</div>
        <div className="text-xs text-muted-foreground mt-1">{votes} votes</div>
      </div>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPlay}
        disabled={!hasVideo}
        className="gap-1"
      >
        <Play className="h-3 w-3" />
        {hasVideo ? "Play 15s" : "No Video"}
      </Button>
    </div>
  )
}
