import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"

interface VideoCardProps {
  isNew?: boolean
  isWinner?: boolean
}

export function VideoCard({ isNew, isWinner }: VideoCardProps) {
  // Mock data
  const categories = ["Singing", "Rapping", "Comedy", "Dancing"]
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const randomLikes = Math.floor(Math.random() * 1000) + 100
  const randomComments = Math.floor(Math.random() * 50) + 5

  // Random username generation
  const usernames = ["alex_beats", "melody_maker", "comedy_king", "dance_queen", "rap_master", "vocal_star"]
  const randomUsername = usernames[Math.floor(Math.random() * usernames.length)]

  // Random avatar color
  const colors = ["bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <Link href={`/video/${Math.random().toString(36).substring(7)}`}>
        <div className="relative aspect-[9/16] bg-muted">
          {/* Placeholder for video thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span className="sr-only">Video thumbnail</span>
          </div>

          {isNew && <Badge className="absolute top-2 left-2 bg-blue-500">New</Badge>}

          {isWinner && <Badge className="absolute top-2 left-2 bg-yellow-500">Winner</Badge>}

          <Badge variant="outline" className="absolute bottom-2 right-2 bg-black/50 text-white border-0">
            0:15
          </Badge>

          <Badge variant="outline" className="absolute top-2 right-2 bg-black/50 text-white border-0">
            {randomCategory}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-3">
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={randomColor}>{randomUsername.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Amazing {randomCategory} Performance</p>
            <p className="text-sm text-muted-foreground truncate">@{randomUsername}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <Heart className="h-4 w-4" />
            {randomLikes}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <MessageCircle className="h-4 w-4" />
            {randomComments}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
