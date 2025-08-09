"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Mock function to simulate wallet connection
  const connectWallet = (type: string) => {
    setIsConnected(true)
    setWalletAddress("0x1a2...3b4c")
  }

  if (isConnected) {
    return (
      <Button variant="outline" className="gap-2 font-mono text-xs">
        <span className="size-2 rounded-full bg-green-500"></span>
        {walletAddress}
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
          <Wallet className="h-4 w-4" />
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to start creating, battling, and earning on ClipClash
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" className="flex justify-start gap-3 h-14" onClick={() => connectWallet("metamask")}>
            <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center">
              <svg viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M31.1916 0.951172L18.7949 10.4908L21.0235 5.32422L31.1916 0.951172Z" fill="#E17726" />
                <path d="M1.80859 0.951172L14.0964 10.5667L11.9765 5.32422L1.80859 0.951172Z" fill="#E27625" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold">MetaMask</div>
              <div className="text-xs text-muted-foreground">Connect using browser extension</div>
            </div>
          </Button>

          <Button variant="outline" className="flex justify-start gap-3 h-14" onClick={() => connectWallet("coinbase")}>
            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <rect width="1024" height="1024" fill="#0052FF" />
                <path d="M512 512m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0" fill="white" />
                <path
                  d="M516.9 395.9c-64.6 0-116.9 52.3-116.9 116.9 0 64.6 52.3 116.9 116.9 116.9 64.6 0 116.9-52.3 116.9-116.9 0-64.6-52.3-116.9-116.9-116.9z"
                  fill="#0052FF"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold">Coinbase Wallet</div>
              <div className="text-xs text-muted-foreground">Connect using Coinbase Wallet</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="flex justify-start gap-3 h-14"
            onClick={() => connectWallet("walletconnect")}
          >
            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                width="28"
                height="20"
                viewBox="0 0 28 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path
                  d="M7.386 6.482C10.589 3.279 15.411 3.279 18.614 6.482L19.014 6.882C19.191 7.059 19.191 7.347 19.014 7.524L17.775 8.763C17.686 8.852 17.542 8.852 17.453 8.763L16.911 8.222C14.722 6.032 11.278 6.032 9.089 8.222L8.511 8.8C8.422 8.889 8.278 8.889 8.189 8.8L6.95 7.561C6.773 7.384 6.773 7.096 6.95 6.919L7.386 6.482ZM21.075 8.943L22.175 10.043C22.352 10.22 22.352 10.508 22.175 10.685L16.573 16.287C16.396 16.464 16.108 16.464 15.931 16.287L12.069 12.425C12.025 12.38 11.953 12.38 11.908 12.425L8.047 16.287C7.87 16.464 7.582 16.464 7.405 16.287L1.803 10.685C1.626 10.508 1.626 10.22 1.803 10.043L2.903 8.943C3.08 8.766 3.368 8.766 3.545 8.943L7.406 12.804C7.451 12.849 7.523 12.849 7.568 12.804L11.429 8.943C11.606 8.766 11.894 8.766 12.071 8.943L15.932 12.804C15.977 12.849 16.049 12.849 16.094 12.804L19.955 8.943C20.132 8.766 20.42 8.766 20.597 8.943H21.075V8.943Z"
                  fill="#3396FF"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold">WalletConnect</div>
              <div className="text-xs text-muted-foreground">Connect using WalletConnect</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
