import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FlameIcon as Fire, Mic, Music, ThumbsUp, TrendingUp, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { VideoCard } from "@/components/video-card"
import { FeaturedBattle } from "@/components/featured-battle"

export default function Home() {
  // Mock categories
  const categories = [
    { id: "singing", name: "Singing", icon: Mic },
    { id: "rapping", name: "Rapping", icon: Music },
    { id: "comedy", name: "Comedy", icon: ThumbsUp },
    { id: "dancing", name: "Dancing", icon: Users },
  ]

  return (
    <div className="container py-6 space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 py-12 px-6 text-white">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Now on Base Blockchain
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Battle with your best 15-second performances
            </h1>
            <p className="text-white/80 text-lg">
              Upload clips, compete in battles, earn $CLASH tokens, and build your on-chain reputation
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                Start Creating
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Watch Battles
              </Button>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-pink-400/20 blur-3xl"></div>
            <div className="absolute -right-10 -bottom-20 size-64 rounded-full bg-purple-400/20 blur-3xl"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[9/16] rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl"></div>
                <div className="aspect-[9/16] rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl"></div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-[9/16] rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl"></div>
                <div className="aspect-[9/16] rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl"></div>
              </div>
            </div>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="trending" className="gap-1">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new" className="gap-1">
                <Fire className="h-4 w-4" />
                New
              </TabsTrigger>
              <TabsTrigger value="winners" className="gap-1">
                <Trophy className="h-4 w-4" />
                Winners
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {categories.map((category) => (
                <Button key={category.id} variant="outline" size="sm" className="gap-1">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="trending" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <VideoCard key={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <VideoCard key={i} isNew />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="winners" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <VideoCard key={i} isWinner />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
