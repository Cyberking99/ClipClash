"use client"

import { useState } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useUser } from "@/hooks"

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { userProfile } = useUser()
  const [copied, setCopied] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openExplorer = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <Button 
        className="bg-[#1f4140] hover:bg-[#183736] text-white font-medium px-4 py-2 rounded-lg transition-colors"
        onClick={() => {
          // Trigger RainbowKit modal
          const connectButton = document.querySelector('[data-testid="rk-connect-button"]') as HTMLElement
          if (connectButton) {
            connectButton.click()
          }
        }}
      >
        <Wallet className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-3 bg-blue-300 hover:bg-gray-50 border-gray-200 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#1f4140] text-white text-xs">
                {address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">
                {userProfile?.username || formatAddress(address || '')}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatAddress(address || '')}
              </div>
            </div>
            <div className="sm:hidden text-sm font-medium">
              {userProfile?.username || formatAddress(address || '')}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#1f4140] text-white">
                {address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {userProfile?.username || 'Anonymous'}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {formatAddress(address || '')}
              </div>
              {userProfile?.isRegistered && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Registered
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => disconnect()} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
