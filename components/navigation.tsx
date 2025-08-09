"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Swords, Trophy, Upload, User, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { TokenBalance } from "@/components/token-balance"

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Discover",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/battles",
      label: "Battles",
      icon: Swords,
      active: pathname === "/battles",
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      active: pathname === "/leaderboard",
    },
    {
      href: "/upload",
      label: "Create",
      icon: Upload,
      active: pathname === "/upload",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="md:hidden" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative size-8 overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
              <Swords className="absolute inset-1 text-white" />
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
              <route.icon className={cn("h-4 w-4", route.active && "text-pink-500")} />
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <TokenBalance />
          <ConnectWalletButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background border-t">
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
                <route.icon className={cn("h-5 w-5", route.active && "text-pink-500")} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
