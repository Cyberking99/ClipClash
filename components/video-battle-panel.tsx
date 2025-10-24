"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"

export type VideoBattlePanelProps = {
  side: "left" | "right"
  name: string
  handle: string
  imageSrc?: string
  videoSrc?: string
  category?: string
  onVote?: () => void
}

export function VideoBattlePanel({
  side,
  name,
  handle,
  imageSrc = "/placeholder-user.jpg",
  videoSrc,
  category = "Open",
  onVote,
}: VideoBattlePanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setIsPlaying(true)
    } else {
      el.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="w-full">
      {/* Media card with background image and play icon */}
      <div className="relative rounded-lg border overflow-hidden">
        <div className="relative aspect-video">
          <Image src={imageSrc} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          {videoSrc && (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full ${isPlaying ? "opacity-100" : "opacity-0"}`}
              src={videoSrc}
              controls={false}
              preload="metadata"
              onEnded={() => setIsPlaying(false)}
            />
          )}

          {/* Overlay controls */}
          {!isPlaying && (
            <button
              type="button"
              aria-label="Play preview"
              onClick={toggle}
              className="absolute inset-0 grid place-items-center"
            >
              <div className="size-12 grid place-items-center rounded-full border bg-background/70">
                <Play className="h-6 w-6" />
              </div>
            </button>
          )}

          {/* Category and nameplate */}
          <Badge variant="outline" className="absolute top-2 left-2">
            {category}
          </Badge>
          <div className={`absolute bottom-2 ${side === "right" ? "right-2" : "left-2"}`}>
            <div className="rounded-sm px-2 py-1 text-sm font-extrabold tracking-wide bg-black text-amber-400">
              {name}
            </div>
            <div className="text-[11px] mt-1 px-1 py-0.5 rounded bg-background/80 inline-block">{handle}</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between p-2 border-t">
          <div className="text-xs text-muted-foreground">15s preview</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={toggle}>
              {isPlaying ? "Pause" : "Play 15s"}
            </Button>
            <Button size="sm" className="bg-[#1f4140] hover:bg-[#183736] w-full sm:w-auto" onClick={onVote}>
              Vote {name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


