"use client"

import { useAccount } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTokenBalance, useTokenInfo } from "@/hooks"
import { Loader2, RefreshCw, Wallet, Coins } from "lucide-react"

interface EnhancedTokenBalanceProps {
  variant?: 'button' | 'card' | 'minimal'
  showRefresh?: boolean
  onRefresh?: () => void
}

export function EnhancedTokenBalance({ 
  variant = 'button', 
  showRefresh = false,
  onRefresh 
}: EnhancedTokenBalanceProps) {
  const { address, isConnected } = useAccount()
  const { balance, rawBalance, symbol, name, isLoading, error, refetchBalance } = useTokenBalance(address)
  const { decimals, isLoading: isInfoLoading } = useTokenInfo()
  
  // Type-safe symbol handling
  const tokenSymbol = symbol && typeof symbol === 'string' ? symbol : '$CLASH'
  const tokenName = name && typeof name === 'string' ? name : 'CLASH Token'
  const symbolChar = tokenSymbol.charAt(0)

  const handleRefresh = () => {
    refetchBalance()
    onRefresh?.()
  }

  // Show loading state
  if (isLoading || isInfoLoading) {
    if (variant === 'card') {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Token Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading balance...</span>
            </div>
          </CardContent>
        </Card>
      )
    }

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
    if (variant === 'card') {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Token Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500">
                <div className="size-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] font-bold text-white">
                  !
                </div>
                <span className="text-sm">Error loading balance</span>
              </div>
              {showRefresh && (
                <Button variant="ghost" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

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
    if (variant === 'card') {
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Token Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="size-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-white">
                ?
              </div>
              <span className="text-sm">Connect wallet to view balance</span>
            </div>
          </CardContent>
        </Card>
      )
    }

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

  // Card variant
  if (variant === 'card') {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Token Balance
            </div>
            {showRefresh && (
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {symbolChar}
              </div>
              <div>
                <div className="font-mono text-lg font-bold">{balance || '0'}</div>
                <div className="text-xs text-muted-foreground">{tokenSymbol}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {tokenName}
              </Badge>
              {decimals && (
                <Badge variant="secondary" className="text-xs">
                  {decimals} decimals
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="size-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
          {symbolChar}
        </div>
        <span className="font-mono">{balance || '0'}</span>
        <span className="text-muted-foreground">{tokenSymbol}</span>
      </div>
    )
  }

  // Default button variant
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
          <div className="space-y-1">
            <p className="font-medium">Your {tokenSymbol} token balance</p>
            <p className="text-xs text-muted-foreground">
              {tokenName} • {decimals} decimals
            </p>
            {rawBalance && (
              <p className="text-xs text-muted-foreground font-mono">
                Raw: {rawBalance.toString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
