import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { WalletProvider } from "@/components/wallet-provider"
import { FarcasterMiniAppProvider } from "@/components/farcaster-miniapp-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClipClash | Battle with your best 15-second performances",
  description: "A Web3 platform for creators to battle with short performance clips and earn rewards",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FarcasterMiniAppProvider>
            <WalletProvider>
              <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
                <Navigation />
                <main>{children}</main>
              </div>
            </WalletProvider>
          </FarcasterMiniAppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
