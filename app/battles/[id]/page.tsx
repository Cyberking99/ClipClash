"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { VideoBattlePanel } from "@/components/video-battle-panel"
import { Badge } from "@/components/ui/badge"

export default function BattleDetailPage() {
  const params = useParams<{ id: string }>()
  const [leftVotes, setLeftVotes] = useState(48)
  const [rightVotes, setRightVotes] = useState(52)

  const total = Math.max(leftVotes + rightVotes, 1)
  const leftPct = Math.round((leftVotes / total) * 100)
  const rightPct = 100 - leftPct

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Battle #{params.id}</h1>
        <Badge variant="outline">Prize: 5,000 $CLASH</Badge>
      </div>

      <div className="grid gap-6">
        <VideoBattlePanel
          side="left"
          name="GUNNER"
          handle="@gunner"
          imageSrc="/player1.jpg"
          videoSrc=""
          category="Singing"
          onVote={() => setLeftVotes((v) => v + 1)}
        />

        <VideoBattlePanel
          side="right"
          name="DJAMES"
          handle="@djames"
          imageSrc="/palyer2.jpg"
          videoSrc=""
          category="Singing"
          onVote={() => setRightVotes((v) => v + 1)}
        />
      </div>

      {/* <div className="mt-2">
        <div className="h-2 w-full rounded-full bg-muted relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-[#1f4140]" style={{ width: `${leftPct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{leftPct}%</span>
          <span>{rightPct}%</span>
        </div>
      </div> */}
    </div>
  )
}


