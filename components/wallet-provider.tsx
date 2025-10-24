"use client"

import { ReactNode, useMemo } from "react"
import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type WalletProviderProps = {
  children: ReactNode
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo'

const config = getDefaultConfig({
  appName: 'ClipClash',
  projectId,
  chains: [base, baseSepolia, mainnet],
  ssr: true,
})

export function WalletProvider({ children }: WalletProviderProps) {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          } as any}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}


