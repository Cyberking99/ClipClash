"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useUser } from "@/hooks"

type RegisterModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RegisterModal({ open, onOpenChange, onSuccess }: RegisterModalProps) {
  const { isConnected, address } = useAccount()
  const [name, setName] = useState("")
  const [touched, setTouched] = useState(false)
  
  // Use the ClipClash user hook
  const { userProfile, register, isRegistering, error } = useUser()

  useEffect(() => {
    // Close modal when user is successfully registered
    if (userProfile?.isRegistered) {
      onOpenChange(false)
      onSuccess?.()
    }
  }, [userProfile?.isRegistered, onOpenChange, onSuccess])

  const canConnect = name.trim().length >= 2
  const isRegistered = userProfile?.isRegistered || false

  const onRegister = async () => {
    if (!canConnect) return
    await register(name.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRegistered ? 'Welcome back' : 'Set your creator name'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {isRegistered ? (
            <p className="text-sm text-muted-foreground">
              You are already registered as <span className="font-semibold">{userProfile?.username}</span>.
            </p>
          ) : (
            <>
              <Input
                placeholder="e.g. JazzDiva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
              />
              {touched && name.trim().length < 2 && (
                <p className="text-xs text-red-500">Name must be at least 2 characters</p>
              )}
            </>
          )}

          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
            <ConnectButton.Custom>
              {({ openConnectModal, mounted, account }) => {
                const canProceed = mounted && account && (isRegistered || canConnect)
                return (
                  <Button
                    disabled={isRegistering || (!mounted && !account)}
                    className="bg-[#1f4140] hover:bg-[#183736]"
                    onClick={() => {
                      if (!mounted || !account) return openConnectModal?.()
                      if (isRegistered) return onOpenChange(false)
                      return onRegister()
                    }}
                  >
                    {!mounted || !account ? 'Connect Wallet' : isRegistered ? 'Continue' : (isRegistering ? 'Confirming...' : 'Register')}
                  </Button>
                )
              }}
            </ConnectButton.Custom>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}


