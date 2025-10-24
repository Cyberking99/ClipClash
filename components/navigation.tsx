"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Swords, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { TokenBalance } from "@/components/token-balance"
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (pathname === "/") {
    return null
  }

  const routes = [
    {
      href: "/home",
      label: "Discover",
      active: pathname === "/home",
    },
    {
      href: "/battles",
      label: "Battles",
      active: pathname === "/battles",
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      active: pathname === "/leaderboard",
    },
    {
      href: "/upload",
      label: "Create",
      active: pathname === "/upload",
    },
    {
      href: "/profile",
      label: "Profile",
      active: pathname === "/profile",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="md:hidden" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/home" className="flex items-center gap-2">
            <div className="relative size-8 overflow-hidden rounded-full bg-[#1f4140] text-white">
              <Swords className="absolute inset-1" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">ClipClash</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-5">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground/80",
                route.active ? "text-foreground" : "text-foreground/60",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <TokenBalance />
          <ConnectWalletButton />
          {/* Hidden RainbowKit button for modal functionality */}
          <div className="hidden">
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 animate-in md:hidden bg-background border-t">
          <div className="grid gap-4">
            {/* Mobile Wallet Section */}
            <div className="flex flex-col gap-3 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet</span>
                <ConnectWalletButton />
              </div>
              <TokenBalance />
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="grid gap-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                    route.active ? "bg-accent" : "transparent",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
