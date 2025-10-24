"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { IPFSVideoPlayer } from "@/components/ipfs-video-player"
import { useAccount, useReadContract, usePublicClient } from "wagmi"
import { CLIPCLASH_CONTRACT_ADDRESS, CLIP_TOKEN_ADDRESS } from "@/hooks/contractAddress"
import { CLIPCLASH_CONTRACT_ABI } from "@/hooks/contractAbi"
import { getBattleStatus, formatTimeRemaining } from "@/hooks"
import { Play, Vote, Users, Clock, Trophy, ArrowLeft, DollarSign } from "lucide-react"
import { VoteModal } from "@/components/vote-modal"
import Link from "next/link"

export default function BattleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  
  const [battle, setBattle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creator1Profile, setCreator1Profile] = useState<any>(null)
  const [creator2Profile, setCreator2Profile] = useState<any>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<{ address: string; name: string } | null>(null)

  const battleId = params.id as string

  // Fetch battle data
  useEffect(() => {
    const fetchBattle = async () => {
      if (!publicClient || !battleId) return

      try {
        setIsLoading(true)
        setError(null)

        // Fetch battle data from contract
        const battleData = await publicClient.readContract({
          address: CLIPCLASH_CONTRACT_ADDRESS,
          abi: CLIPCLASH_CONTRACT_ABI,
          functionName: 'battles',
          args: [BigInt(battleId)],
        })

        // Check if battle exists
        if (!battleData || battleData[0] === BigInt(0)) {
          setError('Battle not found')
          return
        }

        // Transform battle data
        const battleInfo = {
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
        }

        setBattle(battleInfo)

        // Fetch creator profiles
        const [profile1, profile2] = await Promise.all([
          publicClient.readContract({
            address: CLIPCLASH_CONTRACT_ADDRESS,
            abi: CLIPCLASH_CONTRACT_ABI,
            functionName: 'getUserProfile',
            args: [battleInfo.creator1 as `0x${string}`],
          }),
          battleInfo.creator2 !== "0x0000000000000000000000000000000000000000" 
            ? publicClient.readContract({
                address: CLIPCLASH_CONTRACT_ADDRESS,
                abi: CLIPCLASH_CONTRACT_ABI,
                functionName: 'getUserProfile',
                args: [battleInfo.creator2 as `0x${string}`],
              })
            : null
        ])

        setCreator1Profile(profile1)
        setCreator2Profile(profile2)

      } catch (err) {
        console.error('Error fetching battle:', err)
        setError('Failed to load battle details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBattle()
  }, [publicClient, battleId])

  const handleVote = (creatorAddress: string, creatorName: string) => {
    setSelectedCreator({ address: creatorAddress, name: creatorName })
    setShowVoteModal(true)
  }

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f4140] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading battle details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !battle) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1f4140] mb-4">Battle Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'This battle does not exist'}</p>
          <Button asChild>
            <Link href="/battles">Back to Battles</Link>
          </Button>
        </div>
      </div>
    )
  }

  const status = getBattleStatus(battle)
  const leftVotes = Number(battle.votes1)
  const rightVotes = Number(battle.votes2)
  const totalVotes = Math.max(leftVotes + rightVotes, 1)
  const leftPct = Math.round((leftVotes / totalVotes) * 100)
  const rightPct = 100 - leftPct

  const entryFeeFormatted = Number(battle.entryFee) / 1e18
  const prizePool = entryFeeFormatted * 2

  const creator1Name = creator1Profile?.[0] || "Creator1"
  const creator2Name = battle.creator2 === "0x0000000000000000000000000000000000000000" 
    ? "Waiting for challenger" 
    : creator2Profile?.[0] || "Creator2"

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/battles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Battles
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Battle #{battle.battleId.toString()}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize">{battle.category}</Badge>
            <Badge className={
              status === "live" ? "bg-red-500 text-white" : 
              status === "upcoming" ? "bg-blue-500 text-white" : 
              "bg-green-600 text-white"
            }>
              {status === "live" ? "Live" : status === "upcoming" ? "Upcoming" : "Completed"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Battle Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Entry Fee</p>
                <p className="text-lg font-semibold">{entryFeeFormatted} $CLASH</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <p className="text-lg font-semibold">{prizePool.toFixed(0)} $CLASH</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-lg font-semibold">{totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p className="text-lg font-semibold">
                  {status === "live" || status === "upcoming" 
                    ? formatTimeRemaining(Number(battle.votingEndTime) - Math.floor(Date.now() / 1000))
                    : "Ended"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contestants */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Creator 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{creator1Name}</span>
              <Badge variant="outline">Creator</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {battle.ipfsHash1 ? (
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <IPFSVideoPlayer
                  ipfsHash={battle.ipfsHash1}
                  className="w-full h-full"
                  controls={true}
                  muted
                  poster={`https://gateway.pinata.cloud/ipfs/${battle.ipfsHash1}`}
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No video available</p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Votes</span>
                <span className="font-semibold">{leftVotes}</span>
              </div>
              <Progress value={leftPct} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">{leftPct}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Creator 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{creator2Name}</span>
              <Badge variant="outline">
                {battle.creator2 === "0x0000000000000000000000000000000000000000" ? "Waiting" : "Challenger"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {battle.ipfsHash2 ? (
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <IPFSVideoPlayer
                  ipfsHash={battle.ipfsHash2}
                  className="w-full h-full"
                  controls={true}
                  muted
                  poster={`https://gateway.pinata.cloud/ipfs/${battle.ipfsHash2}`}
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {battle.creator2 === "0x0000000000000000000000000000000000000000" 
                    ? "Waiting for challenger" 
                    : "No video available"
                  }
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Votes</span>
                <span className="font-semibold">{rightVotes}</span>
              </div>
              <Progress value={rightPct} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">{rightPct}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {status === "live" && battle.creator2 !== "0x0000000000000000000000000000000000000000" && (
          <>
            <Button 
              className="bg-[#1f4140] text-white hover:bg-[#183736] gap-2"
              onClick={() => handleVote(battle.creator1, creator1Name)}
            >
              <Vote className="h-4 w-4" />
              Vote for {creator1Name}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleVote(battle.creator2, creator2Name)}
            >
              <Vote className="h-4 w-4" />
              Vote for {creator2Name}
            </Button>
          </>
        )}
        {status === "live" && battle.creator2 === "0x0000000000000000000000000000000000000000" && (
          <Button 
            className="bg-[#1f4140] text-white hover:bg-[#183736] gap-2"
            onClick={() => console.log('Join battle')}
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
      </div>

      {/* Vote Modal */}
      {selectedCreator && (
        <VoteModal
          open={showVoteModal}
          onOpenChange={setShowVoteModal}
          battleId={BigInt(battleId)}
          creator={selectedCreator.address}
          creatorName={selectedCreator.name}
          onSuccess={() => {
            // Refetch battle data after successful vote
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}