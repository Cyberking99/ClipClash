"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export type BattleCardProps = {
  status: "live" | "upcoming" | "completed"
  left?: {
    name: string
    handle: string
    imageSrc?: string
    votes?: number
  }
  right?: {
    name: string
    handle: string
    imageSrc?: string
    votes?: number
  }
}

export function BattleCard({
  status,
  left = { name: "GUNNER", handle: "@gunner", imageSrc: "/player1.jpg", votes: 48 },
  right = { name: "DJAMES", handle: "@djames", imageSrc: "/palyer2.jpg", votes: 52 },
}: BattleCardProps) {
  const leftVotes = left.votes ?? 0
  const rightVotes = right.votes ?? 0
  const total = Math.max(leftVotes + rightVotes, 1)
  const leftPct = Math.round((leftVotes / total) * 100)
  const rightPct = 100 - leftPct

  const [open, setOpen] = useState<false | "left" | "right">(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Auto-close after 15s; if viewing left, advance to right next
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
    <Link href={`/battles/${encodeURIComponent(left.name.toLowerCase())}-vs-${encodeURIComponent(right.name.toLowerCase())}`}
      className="rounded-lg border bg-white dark:bg-background p-4 block">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline">Open Category</Badge>
        <Badge className={status === "live" ? "bg-red-500" : status === "upcoming" ? "bg-blue-500" : "bg-green-600"}>
          {status === "live" ? "Live" : status === "upcoming" ? "Upcoming" : "Completed"}
        </Badge>
      </div>

      {/* Contestants */}
      <div className="flex flex-col gap-4">
        <ContestantRow
          side="left"
          name={left.name}
          handle={left.handle}
          imageSrc={left.imageSrc}
          percentage={leftPct}
          onPlay={(e) => { e.preventDefault(); setOpen("left") }}
        />
        <ContestantRow
          side="right"
          name={right.name}
          handle={right.handle}
          imageSrc={right.imageSrc}
          percentage={rightPct}
          onPlay={(e) => { e.preventDefault(); setOpen("right") }}
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
          <Badge variant="outline">Ends in 3h 45m</Badge>
          <Badge variant="outline">Prize: 5,000 $CLASH</Badge>
        </div>
        <Button size="sm" className="bg-[#1f4140] text-white hover:bg-[#183736] w-full sm:w-auto">
          {status === "live" ? "Vote Now" : status === "upcoming" ? "Set Reminder" : "View Results"}
        </Button>
      </div>
      <Dialog open={Boolean(open)} onOpenChange={(v) => setOpen(v ? (open || "left") : false)}>
        <DialogContent className="p-0 sm:max-w-lg">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-base">
              {open === "left" ? left.name : right.name}
              <span className="text-xs text-muted-foreground"> {open === "left" ? left.handle : right.handle}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full">
            {/* TODO: Replace with real clip sources */}
            <video ref={videoRef} className="w-full" src="" controls={false} preload="metadata" />
            <div className="flex items-center justify-between p-3 border-t">
              <Badge variant="outline">15s Preview</Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); setOpen(false) }}>Close</Button>
                {open === "left" && (
                  <Button size="sm" className="bg-[#1f4140] text-white" onClick={(e) => { e.preventDefault(); setOpen("right") }}>Next</Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Link>
  )
}

function ContestantRow({
  side,
  name,
  handle,
  imageSrc = "/placeholder-user.jpg",
  percentage,
  onPlay,
}: {
  side: "left" | "right"
  name: string
  handle: string
  imageSrc?: string
  percentage: number
  onPlay?: (e: React.MouseEvent) => void
}) {
  return (
    <div className={`flex items-center ${side === "right" ? "flex-row-reverse" : ""} gap-3`}>
      <div className="relative size-16 md:size-20 overflow-hidden rounded-md border">
        <Image src={imageSrc} alt={name} fill sizes="80px" className="object-cover" />
      </div>
      <div className={`flex-1 ${side === "right" ? "text-right" : ""}`}>
        <div className={`inline-block rounded-sm px-3 py-1 text-sm font-extrabold tracking-wide ${side === "right" ? "ml-auto" : ""} bg-black text-amber-400`}>
          {name}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{handle}</div>
      </div>
      <Button size="sm" variant="outline" onClick={onPlay}>Play 15s</Button>
    </div>
  )
}


