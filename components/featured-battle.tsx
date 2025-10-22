import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock } from "lucide-react"

export function FeaturedBattle() {
  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-0">
        <div className="grid gap-0 md:grid-cols-2">
          <ContestantBlock
            imageSrc="/singing1.jpg"
            handle="@gunner"
            category="Singing"
            title="Gunner - 15s Clip"
            align="left"
          />
          <ContestantBlock
            imageSrc="/singing2.jpg"
            handle="@djames"
            category="Singing"
            title="DJames - 15s Clip"
            align="right"
          />

          {/* VS pill (desktop) */}
          <div className="absolute hidden md:flex inset-0 items-center justify-center pointer-events-none">
            <div className="rounded-full border px-4 py-2 text-sm font-bold bg-background">VS</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
              <Badge variant="outline" className="gap-1">
               
                Ends in 3h 45m
              </Badge>
              <Badge variant="outline">Prize: 5,000 $CLASH</Badge>
            </div>
            <Button size="sm" className="bg-[#1f4140] hover:bg-[#183736] w-full sm:w-auto">
              View Battle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ContestantBlock({
  imageSrc,
  handle,
  category,
  title,
  align,
}: {
  imageSrc: string
  handle: string
  category: string
  title: string
  align: "left" | "right"
}) {
  const isRight = align === "right"
  return (
    <div className={`relative ${isRight ? "" : "border-r border-border"}`}>
      <div className="relative aspect-video">
        <Image src={imageSrc} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />

        {/* Category */}
        <Badge variant="outline" className="absolute top-2 left-2">
          {category}
        </Badge>

        {/* Play icon */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-12 grid place-items-center rounded-full border bg-background/70">
            <Play className="h-6 w-6" />
          </div>
        </div>

        {/* Handle */}
        <div className={`absolute bottom-2 ${isRight ? "right-2" : "left-2"}`}>
          <div className="rounded-md border bg-background/80 px-2 py-1 text-sm">{handle}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-2 text-base">{title}</h3>
        <div className={`flex items-center justify-between`}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{isRight ? "52%" : "48%"}</Badge>
          </div>
          <Button variant="outline" size="sm">Vote</Button>
        </div>
      </div>
    </div>
  )
}
