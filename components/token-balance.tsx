"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TokenBalance() {
  // Mock token balance
  const balance = "1,250"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 font-mono">
            <div className="size-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
              C
            </div>
            {balance}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your $CLASH token balance</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
