"use client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Filter, FlameIcon as Fire, Flame, Mic, Music, ThumbsUp, Trophy, Users, Loader2 } from "lucide-react"
import { EnhancedBattleCard } from "@/components/enhanced-battle-card"
import { useBattlesList, getBattleStatus } from "@/hooks"
import { useState } from "react"

// Categories with actual icon components
const categories = [
  { id: "all", name: "All Categories", icon: Filter },
  { id: "singing", name: "Singing", icon: Mic },
  { id: "rapping", name: "Rapping", icon: Music },
  { id: "comedy", name: "Comedy", icon: ThumbsUp },
  { id: "dancing", name: "Dancing", icon: Users },
]

export default function BattlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("live")
  
  // Get real battle data
  const { battles, isLoading, error, refetch } = useBattlesList(20)

  // Filter battles by category and status
  const filteredBattles = battles.filter(battle => {
    const categoryMatch = selectedCategory === "all" || battle.category === selectedCategory
    const statusMatch = getBattleStatus(battle) === activeTab
    return categoryMatch && statusMatch
  })

  const liveBattles = battles.filter(battle => getBattleStatus(battle) === "live")
  const upcomingBattles = battles.filter(battle => getBattleStatus(battle) === "upcoming")
  const completedBattles = battles.filter(battle => getBattleStatus(battle) === "completed")

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Battles</h1>
          <p className="text-muted-foreground mt-1">
            {battles.length} total battles • {liveBattles.length} live • {upcomingBattles.length} upcoming
          </p>
        </div>
        <Button className="bg-[#1f4140] hover:bg-[#183736]">
          Create Battle
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button 
            key={category.id} 
            variant={category.id === selectedCategory ? "default" : "outline"} 
            size="sm" 
            className="gap-1"
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon className="h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Battle Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="gap-1">
            <Flame className="h-4 w-4 text-red-500" />
            Live Battles ({liveBattles.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1">
            <Fire className="h-4 w-4 text-orange-500" />
            Upcoming ({upcomingBattles.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Completed ({completedBattles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading battles...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load battles: {error}</p>
              <Button onClick={refetch} variant="outline">Try Again</Button>
            </div>
          ) : liveBattles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No live battles found</p>
              <Button className="bg-[#1f4140] hover:bg-[#183736]">Create First Battle</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {liveBattles.map((battle) => (
                <EnhancedBattleCard key={battle.battleId.toString()} battle={battle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading battles...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load battles: {error}</p>
              <Button onClick={refetch} variant="outline">Try Again</Button>
            </div>
          ) : upcomingBattles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No upcoming battles found</p>
              <Button className="bg-[#1f4140] hover:bg-[#183736]">Create First Battle</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingBattles.map((battle) => (
                <EnhancedBattleCard key={battle.battleId.toString()} battle={battle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading battles...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load battles: {error}</p>
              <Button onClick={refetch} variant="outline">Try Again</Button>
            </div>
          ) : completedBattles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No completed battles found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedBattles.map((battle) => (
                <EnhancedBattleCard key={battle.battleId.toString()} battle={battle} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
