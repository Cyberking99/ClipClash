import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Filter, FlameIcon as Fire, Flame, Mic, Music, ThumbsUp, Trophy, Users } from "lucide-react"
import { FeaturedBattle } from "@/components/featured-battle"

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
        <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
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
          <FeaturedBattle />

          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <BattleCard key={i} status="live" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <BattleCard key={i} status="upcoming" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <BattleCard key={i} status="completed" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BattleCardProps {
  status: "live" | "upcoming" | "completed"
}

function BattleCard({ status }: BattleCardProps) {
  // Mock data
  const categories = ["Singing", "Rapping", "Comedy", "Dancing"]
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]

  const getStatusBadge = () => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500">Live Now</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500">Starts in 2h</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{randomCategory}</Badge>
          {getStatusBadge()}
        </div>
        <CardTitle className="text-lg">
          {randomCategory === "Singing"
            ? "Vocal Battle: Pop vs Rock"
            : randomCategory === "Rapping"
              ? "Flow Masters: East vs West"
              : randomCategory === "Comedy"
                ? "Stand-up Showdown"
                : "Dance-off: Hip Hop vs Contemporary"}
        </CardTitle>
        <CardDescription>Prize Pool: {Math.floor(Math.random() * 10000) + 1000} $CLASH</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="aspect-video bg-muted rounded-md relative">
              {/* Contestant 1 */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Badge variant="outline" className="bg-black/50 text-white border-0">
                  @user1
                </Badge>
              </div>
            </div>
            {status === "completed" && (
              <Badge className="w-full justify-center" variant={Math.random() > 0.5 ? "default" : "outline"}>
                {Math.random() > 0.5 ? "Winner" : ""}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="aspect-video bg-muted rounded-md relative">
              {/* Contestant 2 */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <Badge variant="outline" className="bg-black/50 text-white border-0">
                  @user2
                </Badge>
              </div>
            </div>
            {status === "completed" && (
              <Badge className="w-full justify-center" variant={Math.random() > 0.5 ? "default" : "outline"}>
                {Math.random() > 0.5 ? "Winner" : ""}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button size="sm">
            {status === "live" ? "Vote Now" : status === "upcoming" ? "Set Reminder" : "View Results"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
