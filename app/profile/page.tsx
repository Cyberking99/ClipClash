"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Award, Copy, ExternalLink, Heart, MessageCircle, Settings, Share2, Swords, Trophy, Users } from "lucide-react"
import { VideoCard } from "@/components/video-card"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1a2...3b4c")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-6 space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"></div>
        <div className="absolute -bottom-16 left-8">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarFallback className="bg-pink-500 text-2xl">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Jazz Diva</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">@jazz_diva</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy address</span>
            </Button>
            {copied && <span className="text-xs text-muted-foreground">Copied!</span>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              1.2K Followers
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" />
              32 Wins
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Swords className="h-3 w-3" />
              54 Battles
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            View on Base
          </Button>
          <Button size="sm" className="gap-1">
            <Users className="h-4 w-4" />
            Follow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">$CLASH Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground mt-1">+125 earned this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">59%</div>
            <Progress value={59} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">875</div>
            <div className="flex items-center gap-1 mt-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-xs">Gold Tier Creator</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NFT Badges */}
      <div>
        <h2 className="text-xl font-bold mb-4">Achievement Badges</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="size-20 rounded-lg bg-muted flex items-center justify-center border">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-xs text-center mt-2">
                {["Battle Champion", "Rising Star", "Crowd Favorite", "Viral Hit", "Top Creator"][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="clips">
        <TabsList>
          <TabsTrigger value="clips">My Clips</TabsTrigger>
          <TabsTrigger value="battles">Battles</TabsTrigger>
          <TabsTrigger value="staked">Staked Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="clips" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <VideoCard key={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="battles" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{["Singing", "Rapping", "Comedy", "Dancing"][i % 4]}</Badge>
                    <Badge className={i % 2 === 0 ? "bg-green-500" : "bg-red-500"}>
                      {i % 2 === 0 ? "Won" : "Lost"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video bg-muted rounded-md"></div>
                    <div className="aspect-video bg-muted rounded-md"></div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Heart className="h-3 w-3" />
                        {Math.floor(Math.random() * 1000) + 100}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {Math.floor(Math.random() * 50) + 5}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Battle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staked" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staked Content</CardTitle>
              <CardDescription>Content you've staked $CLASH tokens on for enhanced rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't staked any content yet</p>
                <Button className="mt-4">Stake Content</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your on-chain profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="gap-1">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
