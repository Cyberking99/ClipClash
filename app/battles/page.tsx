import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Filter, FlameIcon as Fire, Flame, Mic, Music, ThumbsUp, Trophy, Users } from "lucide-react"
import { BattleCard } from "@/components/battle-card"

export default function BattlesPage() {
  // Mock categories
  const categories = [
    { id: "all", name: "All Categories", icon: Filter },
    { id: "singing", name: "Singing", icon: Mic },
    { id: "rapping", name: "Rapping", icon: Music },
    { id: "comedy", name: "Comedy", icon: ThumbsUp },
    { id: "dancing", name: "Dancing", icon: Users },
  ]

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Battles</h1>
        <Button className="bg-[#1f4140] hover:bg-[#183736]">
          Create Battle
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button key={category.id} variant={category.id === "all" ? "default" : "outline"} size="sm" className="gap-1">
            <category.icon className="h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Battle Tabs */}
      <Tabs defaultValue="live">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="gap-1">
            <Flame className="h-4 w-4 text-red-500" />
            Live Battles
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1">
            <Fire className="h-4 w-4 text-orange-500" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <BattleCard key={i} status="live" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <BattleCard key={i} status="upcoming" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <BattleCard key={i} status="completed" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
