"use client"

import Image from "next/image"
import { Twitch, Twitter } from "lucide-react"

export type HeroPlayerCardProps = {
  name: string
  age: number
  since: string
  team: string
  earnings: string
  imageSrc?: string
  orientation?: "left" | "right"
}

export function HeroPlayerCard({
  name,
  age,
  since,
  team,
  earnings,
  imageSrc = "/placeholder-user.jpg",
  orientation = "left",
}: HeroPlayerCardProps) {
  const isRight = orientation === "right"

  return (
    <div className={`relative flex flex-col md:flex-row items-center md:items-stretch gap-6 ${isRight ? "md:flex-row-reverse" : ""}`}>
      {/* Emblem / Avatar */}
      <div className="relative w-[180px] md:w-[220px] shrink-0 pb-8 md:pb-0">
        <div className="relative mx-auto w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-xl border-2 border-amber-400 bg-zinc-900 p-2">
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Image src={imageSrc} alt={name} fill sizes="200px" className="object-cover" />
          </div>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
          <div className="px-3 md:px-4 py-1 rounded-md bg-black/90 text-amber-400 text-xl md:text-3xl font-extrabold tracking-wide">
            {name}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="relative w-full md:flex-1">
        <div className="relative rounded-lg border p-4 md:p-6 md:pr-20 text-white bg-zinc-900">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 ${isRight ? "md:text-right" : "md:text-left"} text-left`}>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Age</div>
              <div className="text-lg md:text-xl font-semibold">{age} years</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Since</div>
              <div className="text-lg md:text-xl font-semibold">{since}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Team</div>
              <div className="text-lg md:text-xl font-semibold">{team}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Earnings</div>
              <div className="text-lg md:text-xl font-semibold">{earnings}</div>
            </div>
          </div>


          {/* Notch accent */}
          <div className={`hidden md:block absolute top-4 ${isRight ? "left-[-12px]" : "right-[-12px]"} h-10 w-2 bg-amber-400`}></div>
          <div className={`hidden md:block absolute bottom-4 ${isRight ? "left-[-12px]" : "right-[-12px]"} h-10 w-2 bg-amber-400`}></div>
        </div>
      </div>
    </div>
  )
}


