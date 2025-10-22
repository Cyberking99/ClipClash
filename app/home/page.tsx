"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlameIcon as Fire, Mic, Music, ThumbsUp, TrendingUp, Trophy, Users, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FeaturedBattle } from "@/components/featured-battle"
import { HeroPlayerCard } from "@/components/hero-player-card"

export default function Home() {
  const [open, setOpen] = useState(false)
  const [previewTitle, setPreviewTitle] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const openPreview = (title: string) => {
    setPreviewTitle(title)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const el = videoRef.current
    let timer: ReturnType<typeof setTimeout> | undefined
    if (el) {
      try { el.currentTime = 0 } catch {}
      el.play().catch(() => {})
      timer = setTimeout(() => setOpen(false), 15000)
      const onEnded = () => setOpen(false)
      el.addEventListener("ended", onEnded)
      return () => {
        if (timer) clearTimeout(timer)
        el.removeEventListener("ended", onEnded)
        el.pause()
      }
    }
  }, [open])

  // Mock categories
  const categories = [
    { id: "singing", name: "Singing", icon: Mic },
    { id: "rapping", name: "Rapping", icon: Music },
    { id: "comedy", name: "Comedy", icon: ThumbsUp },
    { id: "dancing", name: "Dancing", icon: Users },
  ]

  const trendingImages = ["singing1.jpg", "dancing1.jpg", "player1.jpg", "palyer2.jpg", "dancing2.jpg", "singing2.jpg"]
  const newImages = ["dancing3.jpg", "dancing2.jpg", "singing2.jpg", "player1.jpg", "palyer2.jpg", "dancing1.jpg"]
  const winnerImages = ["dancer.jpg", "dancer2.png", "singing1.jpg", "dancing3.jpg"]

  return (
    <div className="container py-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r  py-8 md:py-12 px-4 md:px-6">
        <div className="space-y-12 md:space-y-16">
          <HeroPlayerCard
            name="GUNNER"
            age={20}
            since="2019"
            team="ROOSTER"
            earnings="$1,200.00"
            imageSrc="/player1.jpg"
            orientation="left"
          />

          <HeroPlayerCard
            name="DJAMES"
            age={20}
            since="2019"
            team="ROOSTER"
            earnings="$1,200.00"
            imageSrc="/palyer2.jpg"
            orientation="right"
          />
        </div>
      </section>

      {/* Featured Battle */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Battle</h2>
          <Button variant="ghost" asChild>
            <Link href="/battles">View All</Link>
          </Button>
        </div>
        <FeaturedBattle />
      </section>

      {/* Content Tabs */}
      <section>
        <Tabs defaultValue="trending">
          <div className="mb-4 space-y-2">
            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsList className="inline-flex min-w-max gap-1">
                <TabsTrigger value="trending" className="gap-1">Trending</TabsTrigger>
                <TabsTrigger value="new" className="gap-1">New</TabsTrigger>
                <TabsTrigger value="winners" className="gap-1">Winners</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((category) => (
                <Button key={category.id} variant="outline" size="sm" className="gap-1 flex-shrink-0">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="trending" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {trendingImages.map((src, idx) => (
                <div key={src} className="relative aspect-[9/16] sm:aspect-video overflow-hidden rounded-lg border bg-muted">
                  <Image src={`/${src}`} alt="Trending clip" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  <button type="button" aria-label="Play preview" onClick={() => openPreview(`Trending #${idx + 1}`)} className="absolute inset-0 grid place-items-center">
                    <span className="sr-only">Play</span>
                    <div className="size-12 grid place-items-center rounded-full border bg-background/70">
                      <Play className="h-6 w-6" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {newImages.map((src, idx) => (
                <div key={src} className="relative aspect-[9/16] sm:aspect-video overflow-hidden rounded-lg border bg-muted">
                  <Image src={`/${src}`} alt="New clip" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  <button type="button" aria-label="Play preview" onClick={() => openPreview(`New #${idx + 1}`)} className="absolute inset-0 grid place-items-center">
                    <span className="sr-only">Play</span>
                    <div className="size-12 grid place-items-center rounded-full border bg-background/70">
                      <Play className="h-6 w-6" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="winners" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {winnerImages.map((src, idx) => (
                <div key={src} className="relative aspect-[9/16] sm:aspect-video overflow-hidden rounded-lg border bg-muted">
                  <Image src={`/${src}`} alt="Winning clip" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  <button type="button" aria-label="Play preview" onClick={() => openPreview(`Winner #${idx + 1}`)} className="absolute inset-0 grid place-items-center">
                    <span className="sr-only">Play</span>
                    <div className="size-12 grid place-items-center rounded-full border bg-background/70">
                      <Play className="h-6 w-6" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 sm:max-w-lg">
              <DialogHeader className="px-4 pt-4">
                <DialogTitle className="text-base">{previewTitle ?? "Preview"}</DialogTitle>
              </DialogHeader>
              <video ref={videoRef} className="w-full" src="" controls={false} preload="metadata" />
              <div className="p-3 text-xs text-muted-foreground border-t">15s preview</div>
            </DialogContent>
          </Dialog>
        </Tabs>
      </section>
    </div>
  )
}


