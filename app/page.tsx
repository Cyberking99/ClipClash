"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAccount } from "wagmi"
import { useBattle, useLeaderboard } from "@/hooks"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { RegisterModal } from "@/components/register-modal"
import { useState } from "react"

export default function Landing() {
  const { address, isConnected } = useAccount()
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const { battleCount } = useBattle()


  const { totalUsers: leaderboardUsers } = useLeaderboard()
  return (
    <div className="min-h-screen bg-[#f9f8f8]">
      {/* Header with wallet connection */}
      <div className="container py-6">
        <div className="flex justify-end">
          <ConnectWalletButton />
        </div>
      </div>
      
      <div className="container py-24">
        <section className="mx-auto max-w-3xl text-center space-y-6">
          <div>
            <div className="flex flex-row items-center justify-center">
              <h2 className="text-[#1f4140] text-4xl font-bold">Battle </h2>
              <h2 className="text-[#1f4140] text-4xl font-bold ml-2">Vote </h2>
            </div>
            <h2 className="text-[#090909] text-4xl font-bold">Earn</h2>
          </div>
          
          <p className="text-lg text-neutral-600">
            Upload clips, compete in head-to-head battles, and climb the on-chain leaderboard.
          </p>

        
         
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isConnected ? (
              <Button size="lg" asChild>
                <Link href="/home">Let's Go</Link>
              </Button>
            ) : (
              <Button size="lg" onClick={() => setShowRegisterModal(true)}>
                Connect Wallet to Start
              </Button>
            )}
          </div>
        </section>

         <div className="flex justify-center h-96">
           <Image src="/dancer2.png" alt="Hero" width={1000} height={1000}  className="object-contain h-full"/>
         </div>
      </div>
      
      {/* Register Modal */}
      <RegisterModal 
        open={showRegisterModal} 
        onOpenChange={setShowRegisterModal}
      />
    </div>
  )
}
