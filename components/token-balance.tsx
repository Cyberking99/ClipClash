"use client"

import { useAccount } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTokenBalance } from "@/hooks"
import { Loader2 } from "lucide-react"

export function TokenBalance() {
  const { address, isConnected } = useAccount()
  const { balance, symbol, isLoading, error } = useTokenBalance(address)
  
  // Type-safe symbol handling
  const tokenSymbol = symbol && typeof symbol === 'string' ? symbol : '$CLASH'
  const symbolChar = tokenSymbol.charAt(0)

  // Show loading state
  if (isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 font-mono" disabled>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Loading token balance...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Show error state
  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 font-mono text-red-500">
              <div className="size-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] font-bold text-white">
                !
              </div>
              Error
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Failed to load token balance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Show not connected state
  if (!isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 font-mono text-muted-foreground">
              <div className="size-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-white">
                ?
              </div>
              Connect
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connect wallet to view token balance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 font-mono">
            <div className="size-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
              {symbolChar}
            </div>
            {balance || '0'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your {tokenSymbol} token balance</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
