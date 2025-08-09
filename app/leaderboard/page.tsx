import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Award, Calendar, Flame, Mic, Music, ThumbsUp, TrendingUp, Trophy, Users } from "lucide-react"

export default function LeaderboardPage() {
  // Mock categories
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "singing", name: "Singing", icon: Mic },
    { id: "rapping", name: "Rapping", icon: Music },
    { id: "comedy", name: "Comedy", icon: ThumbsUp },
    { id: "dancing", name: "Dancing", icon: Users },
  ]

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button key={category.id} variant={category.id === "all" ? "default" : "outline"} size="sm" className="gap-1">
            {category.icon && <category.icon className="h-4 w-4" />}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="weekly">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="gap-1">
            <Flame className="h-4 w-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="alltime" className="gap-1">
            <Trophy className="h-4 w-4" />
            All Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <LeaderboardTable timeframe="daily" />
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <LeaderboardTable timeframe="weekly" />
        </TabsContent>

        <TabsContent value="alltime" className="mt-6">
          <LeaderboardTable timeframe="alltime" />
        </TabsContent>
      </Tabs>

      {/* Prize Pool */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Prize Pool</CardTitle>
          <CardDescription>Top performers earn $CLASH tokens and exclusive NFT badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">25,000 $CLASH</h3>
                <p className="text-sm text-muted-foreground">Current prize pool</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Resets in 3 days</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button>View Distribution</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface LeaderboardTableProps {
  timeframe: "daily" | "weekly" | "alltime"
}

function LeaderboardTable({ timeframe }: LeaderboardTableProps) {
  // Mock data
  const users = [
    {
      username: "jazz_diva",
      displayName: "Jazz Diva",
      score: 1250,
      category: "Singing",
      wins: 32,
      color: "bg-pink-500",
    },
    {
      username: "rap_master",
      displayName: "Rap Master",
      score: 1180,
      category: "Rapping",
      wins: 28,
      color: "bg-purple-500",
    },
    {
      username: "comedy_king",
      displayName: "Comedy King",
      score: 1050,
      category: "Comedy",
      wins: 25,
      color: "bg-blue-500",
    },
    {
      username: "dance_queen",
      displayName: "Dance Queen",
      score: 980,
      category: "Dancing",
      wins: 23,
      color: "bg-green-500",
    },
    {
      username: "vocal_star",
      displayName: "Vocal Star",
      score: 920,
      category: "Singing",
      wins: 21,
      color: "bg-yellow-500",
    },
    {
      username: "beat_maker",
      displayName: "Beat Maker",
      score: 870,
      category: "Rapping",
      wins: 19,
      color: "bg-red-500",
    },
    {
      username: "laugh_master",
      displayName: "Laugh Master",
      score: 820,
      category: "Comedy",
      wins: 18,
      color: "bg-indigo-500",
    },
    {
      username: "groove_master",
      displayName: "Groove Master",
      score: 780,
      category: "Dancing",
      wins: 16,
      color: "bg-orange-500",
    },
    {
      username: "melody_maker",
      displayName: "Melody Maker",
      score: 730,
      category: "Singing",
      wins: 15,
      color: "bg-teal-500",
    },
    {
      username: "flow_king",
      displayName: "Flow King",
      score: 690,
      category: "Rapping",
      wins: 14,
      color: "bg-cyan-500",
    },
  ]

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 py-3 px-4 border-b font-medium">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Creator</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2 text-center">Wins</div>
        <div className="col-span-2 text-right">Score</div>
      </div>

      {users.map((user, index) => (
        <div
          key={user.username}
          className="grid grid-cols-12 py-3 px-4 items-center border-b last:border-0 hover:bg-muted/50 transition-colors"
        >
          <div className="col-span-1 text-center font-medium">
            {index === 0 ? (
              <div className="inline-flex items-center justify-center size-6 rounded-full bg-yellow-500 text-white">
                <Trophy className="h-3 w-3" />
              </div>
            ) : index === 1 ? (
              <div className="inline-flex items-center justify-center size-6 rounded-full bg-gray-300 text-gray-700">
                <Trophy className="h-3 w-3" />
              </div>
            ) : index === 2 ? (
              <div className="inline-flex items-center justify-center size-6 rounded-full bg-amber-700 text-white">
                <Trophy className="h-3 w-3" />
              </div>
            ) : (
              index + 1
            )}
          </div>
          <div className="col-span-5 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={user.color}>{user.displayName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.displayName}</div>
              <div className="text-xs text-muted-foreground">@{user.username}</div>
            </div>
            {index < 3 && (
              <Badge variant="outline" className="ml-2 gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Award className="h-3 w-3" />
                Top Creator
              </Badge>
            )}
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{user.category}</Badge>
          </div>
          <div className="col-span-2 text-center font-medium">{user.wins}</div>
          <div className="col-span-2 text-right font-bold">{user.score}</div>
        </div>
      ))}
    </div>
  )
}
