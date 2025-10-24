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
import { IPFSVideoPlayer } from "@/components/ipfs-video-player"
import { useAccount } from "wagmi"
import { useBattle, useUser, useLeaderboard, useBattlesList, getBattleStatus } from "@/hooks"
import { RegisterModal } from "@/components/register-modal"

export default function Home() {
  const { address, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [previewTitle, setPreviewTitle] = useState<string | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  
  // Get user data
  const { userProfile, isLoading: isUserLoading, refetchProfile } = useUser()
  
  // Get trending battles
  const { battles, isLoading: isBattlesLoading } = useBattlesList(6)
  const liveBattles = battles.filter(battle => getBattleStatus(battle) === 'live')
  

  
  // Get battle data
  const { battleCount, creatorBattles } = useBattle()
  
  // Get leaderboard data
  const { totalUsers } = useLeaderboard()

  const openPreview = (title: string) => {
    setPreviewTitle(title)
    setOpen(true)
  }
  
  // Check if user needs to register
  useEffect(() => {
    if (isConnected && userProfile && !userProfile.isRegistered) {
      setShowRegisterModal(true)
    }
  }, [isConnected, userProfile])

  // Refetch profile when modal closes (in case registration was successful)
  useEffect(() => {
    if (!showRegisterModal && isConnected) {
      refetchProfile()
    }
  }, [showRegisterModal, isConnected, refetchProfile])

  // Refetch profile when component mounts and user is connected
  useEffect(() => {
    if (isConnected) {
      refetchProfile()
    }
  }, [isConnected, refetchProfile])

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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r py-8 md:py-12 px-4 md:px-6">
        <div className="space-y-12 md:space-y-16">
          {isUserLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f4140] mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading your profile...</p>
            </div>
          ) : userProfile && userProfile.isRegistered ? (
            <>
              <HeroPlayerCard
                name={userProfile.username}
                age={20}
                since="2024"
                team="CLIPCLASH"
                earnings={`${userProfile.points?.toString() || "0"} Points`}
                imageSrc="/player1.jpg"
                orientation="left"
              />
              <HeroPlayerCard
                name="OPPONENT"
                age={20}
                since="2024"
                team="CLIPCLASH"
                earnings="0 Points"
                imageSrc="/palyer2.jpg"
                orientation="right"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-[#1f4140] mb-4">
                {isConnected ? "Complete Your Registration" : "Connect Your Wallet"}
              </h3>
              <p className="text-neutral-600 mb-6">
                {isConnected 
                  ? "Register to start battling and earning rewards!"
                  : "Connect your wallet to join the battle platform."
                }
              </p>
              <Button 
                onClick={() => setShowRegisterModal(true)}
                size="lg"
              >
                {isConnected ? "Complete Registration" : "Connect Wallet"}
              </Button>
            </div>
          )}
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
            {isBattlesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f4140] mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading trending battles...</p>
                </div>
              </div>
            ) : liveBattles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No live battles found</p>
                <Button className="bg-[#1f4140] hover:bg-[#183736]">
                  Create First Battle
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {liveBattles.map((battle) => (
                  <div key={battle.battleId.toString()} className="relative aspect-[9/16] sm:aspect-video overflow-hidden rounded-lg border bg-muted">
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
                          type="button" 
                          aria-label="Play preview" 
                          onClick={() => openPreview(`${battle.category} Battle #${battle.battleId}`)} 
                          className="absolute inset-0 grid place-items-center hover:bg-black/20 transition-colors"
                        >
                          <span className="sr-only">Play</span>
                          <div className="size-12 grid place-items-center rounded-full border bg-background/70">
                            <Play className="h-6 w-6" />
                          </div>
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{battle.category.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/70 text-white text-xs p-2 rounded">
                        <p className="font-bold">{battle.category}</p>
                        <p>{Number(battle.votes1) + Number(battle.votes2)} votes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Floating Create Battle Button */}
      <Link href="/upload" className="fixed bottom-6 right-6 z-40">
        <button className="rounded-full bg-[#1f4140] text-white px-5 py-3 text-sm font-medium">Create Battle</button>
      </Link>
      
      {/* Register Modal */}
      <RegisterModal 
        open={showRegisterModal} 
        onOpenChange={setShowRegisterModal}
        onSuccess={() => {
          // Refetch profile when registration is successful
          refetchProfile()
        }}
      />
    </div>
  )
}


