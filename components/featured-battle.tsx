import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThumbsUp, Clock } from "lucide-react"

export function FeaturedBattle() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Contestant */}
          <div className="relative border-r border-border">
            <div className="aspect-video bg-muted relative">
              {/* Video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="sr-only">Video thumbnail</span>
              </div>

              <Badge className="absolute top-2 left-2 bg-pink-500">Singing</Badge>

              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback className="bg-pink-500">JD</AvatarFallback>
                </Avatar>
                <div className="bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                  <p className="text-white text-sm font-medium">@jazz_diva</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2">Jazz Cover - "Fly Me To The Moon"</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    1,245
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    48%
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Vote
                </Button>
              </div>
            </div>
          </div>

          {/* Right Contestant */}
          <div className="relative">
            <div className="aspect-video bg-muted relative">
              {/* Video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="sr-only">Video thumbnail</span>
              </div>

              <Badge className="absolute top-2 left-2 bg-pink-500">Singing</Badge>

              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback className="bg-purple-500">RK</AvatarFallback>
                </Avatar>
                <div className="bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                  <p className="text-white text-sm font-medium">@rock_king</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2">Rock Cover - "Stairway to Heaven"</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    1,350
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    52%
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Vote
                </Button>
              </div>
            </div>
          </div>

          {/* Battle Info Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-background border-4 border-pink-500 rounded-full size-16 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="font-bold text-xl">VS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Battle Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 bg-background">
                <Clock className="h-3 w-3" />
                Battle ends in 3h 45m
              </Badge>
              <Badge variant="outline" className="gap-1 bg-background">
                Prize Pool: 5,000 $CLASH
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              View Battle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
