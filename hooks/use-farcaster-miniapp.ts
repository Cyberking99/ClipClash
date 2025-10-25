"use client"

import { useEffect, useState } from "react"
import { sdk } from '@farcaster/miniapp-sdk'

export function useFarcasterMiniApp() {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get user information
        const userData = await sdk.actions.getUser()
        setUser(userData)

        // Call ready() to hide the splash screen
        await sdk.actions.ready()
        
        setIsReady(true)
        setIsLoading(false)
        console.log('Farcaster Mini App ready!', userData)
      } catch (err) {
        console.error('Failed to initialize Farcaster Mini App:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize Mini App')
        setIsLoading(false)
        // Still set ready to true to avoid infinite loading
        setIsReady(true)
      }
    }

    initializeMiniApp()
  }, [])

  const shareContent = async (content: string) => {
    try {
      await sdk.actions.shareContent(content)
    } catch (err) {
      console.error('Failed to share content:', err)
      throw err
    }
  }

  const openLink = async (url: string) => {
    try {
      await sdk.actions.openLink(url)
    } catch (err) {
      console.error('Failed to open link:', err)
      throw err
    }
  }

  const showToast = async (message: string) => {
    try {
      await sdk.actions.showToast(message)
    } catch (err) {
      console.error('Failed to show toast:', err)
      throw err
    }
  }

  return {
    isReady,
    isLoading,
    error,
    user,
    shareContent,
    openLink,
    showToast,
  }
}
