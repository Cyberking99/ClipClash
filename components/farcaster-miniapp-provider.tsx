"use client"

import { useEffect, useState } from "react"
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterMiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        // Wait for the app to be fully loaded
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Call ready() to hide the splash screen
        await sdk.actions.ready()
        
        setIsReady(true)
        console.log('Farcaster Mini App ready!')
      } catch (err) {
        console.error('Failed to initialize Farcaster Mini App:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Mini App')
        // Still set ready to true to avoid infinite loading
        setIsReady(true)
      }
    }

    initializeMiniApp()
  }, [])

  // Show loading state while initializing
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f4140] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ClipClash...</p>
        </div>
      </div>
    )
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-500 mb-2">Mini App Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#1f4140] text-white rounded-lg hover:bg-[#183736] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
