"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useBattle } from "@/hooks"
import { parseUnits } from "viem"
import { Vote, DollarSign, AlertCircle } from "lucide-react"

export type VoteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  battleId: bigint
  creator: string
  creatorName: string
  onSuccess?: () => void
}

export function VoteModal({ 
  open, 
  onOpenChange, 
  battleId, 
  creator, 
  creatorName,
  onSuccess 
}: VoteModalProps) {
  const [voteAmount, setVoteAmount] = useState("1")
  const [voteStatus, setVoteStatus] = useState<'idle' | 'checking-allowance' | 'approving-tokens' | 'voting' | 'waiting-confirmation' | 'success' | 'error'>('idle')
  const [voteMessage, setVoteMessage] = useState('')
  const [voteError, setVoteError] = useState<string | null>(null)
  
  const { voteOnBattle, isCreating } = useBattle()

  const handleVote = async () => {
    if (!voteAmount || parseFloat(voteAmount) <= 0) {
      setVoteError('Please enter a valid vote amount')
      return
    }

    try {
      setVoteStatus('checking-allowance')
      setVoteMessage('Checking token allowance...')
      setVoteError(null)

      const amount = parseUnits(voteAmount, 18) // Convert to wei
      
      await voteOnBattle(battleId, creator, amount)

      setVoteStatus('success')
      setVoteMessage(`Successfully voted ${voteAmount} $CLASH for ${creatorName}!`)
      
      // Close modal after success
      setTimeout(() => {
        onOpenChange(false)
        setVoteAmount("1")
        setVoteStatus('idle')
        setVoteMessage('')
        onSuccess?.()
      }, 2000)
      
    } catch (error: any) {
      setVoteStatus('error')
      setVoteMessage(error.message || 'Failed to vote')
      setVoteError(error.message || 'Failed to vote')
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setVoteStatus('idle')
        setVoteMessage('')
        setVoteError(null)
      }, 5000)
    }
  }

  const quickAmounts = [1, 5, 10, 25, 50]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Vote for {creatorName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Vote Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="voteAmount">Vote Amount ($CLASH)</Label>
            <div className="flex gap-2">
              <Input
                id="voteAmount"
                type="number"
                min="0.1"
                step="0.1"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                disabled={voteStatus !== 'idle'}
                className="flex-1"
                placeholder="Enter amount"
              />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>CLASH</span>
              </div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick amounts</Label>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setVoteAmount(amount.toString())}
                  disabled={voteStatus !== 'idle'}
                  className="text-xs"
                >
                  {amount} $CLASH
                </Button>
              ))}
            </div>
          </div>

          {/* Vote Summary */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Voting for:</span>
              <Badge variant="outline">{creatorName}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Amount:</span>
              <span className="font-medium">{voteAmount} $CLASH</span>
            </div>
          </div>

          {/* Status Messages */}
          {voteStatus !== 'idle' && (
            <div className={`p-3 rounded-md text-sm ${
              voteStatus === 'success' ? 'bg-green-100 text-green-800' :
              voteStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {voteMessage}
            </div>
          )}

          {/* Progress Bar */}
          {(voteStatus === 'checking-allowance' || voteStatus === 'approving-tokens' || voteStatus === 'voting' || voteStatus === 'waiting-confirmation') && (
            <div className="space-y-2">
              <Progress 
                value={
                  voteStatus === 'checking-allowance' ? 25 :
                  voteStatus === 'approving-tokens' ? 50 :
                  voteStatus === 'voting' ? 75 :
                  voteStatus === 'waiting-confirmation' ? 100 : 0
                } 
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {voteStatus === 'checking-allowance' ? 'Checking token allowance...' :
                 voteStatus === 'approving-tokens' ? 'Approving CLASH tokens...' :
                 voteStatus === 'voting' ? 'Submitting vote...' :
                 voteStatus === 'waiting-confirmation' ? 'Waiting for transaction confirmation...' :
                 'Processing...'}
              </div>
            </div>
          )}

          {/* Error Display */}
          {voteError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              <AlertCircle className="h-4 w-4" />
              {voteError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleVote}
              disabled={!voteAmount || parseFloat(voteAmount) <= 0 || voteStatus !== 'idle'}
              className="flex-1 bg-[#1f4140] hover:bg-[#183736] disabled:opacity-50"
            >
              {voteStatus === 'checking-allowance' ? 'Checking...' :
               voteStatus === 'approving-tokens' ? 'Approving...' :
               voteStatus === 'voting' ? 'Voting...' :
               voteStatus === 'waiting-confirmation' ? 'Confirming...' :
               voteStatus === 'success' ? 'Success!' :
               'Vote'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setVoteAmount("1")
                setVoteStatus('idle')
                setVoteMessage('')
                setVoteError(null)
              }}
              disabled={voteStatus === 'checking-allowance' || voteStatus === 'approving-tokens' || voteStatus === 'voting' || voteStatus === 'waiting-confirmation'}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
