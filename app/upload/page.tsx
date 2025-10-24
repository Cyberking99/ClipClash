"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { parseUnits } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Upload, Video, CheckCircle, XCircle, Loader2, Swords, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useBattleVideoUpload, useBattle, useUser } from "@/hooks"
import { IPFSVideoPlayer } from "@/components/ipfs-video-player"
import { IPFSConfigHelper } from "@/components/ipfs-config-helper"
import { Progress } from "@/components/ui/progress"

export default function UploadPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [entryFee, setEntryFee] = useState("10")
  const [file, setFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<{
    videoHash: string
    videoUrl: string
    metadataHash?: string
  } | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  // IPFS upload hook
  const {
    isUploading,
    uploadProgress,
    error: uploadError,
    uploadBattleVideo,
    validateVideoFile,
    getVideoDuration,
    clearError
  } = useBattleVideoUpload()

  // Battle creation hook with improved state management
  const { 
    createNewBattle, 
    currentStep,
    isCreating,
    isApproving,
    isWaitingConfirmation,
    error: battleError,
    resetState 
  } = useBattle()

  // User hook for checking registration
  const { userProfile } = useUser()
  const isRegistered = userProfile?.isRegistered || false

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
    setValidationError(null)
    setUploadResult(null)
    clearError()

    if (selectedFile) {
      // Validate file
      const error = validateVideoFile(selectedFile)
      if (error) {
        setValidationError(error)
        return
      }

      // Check duration
      getVideoDuration(selectedFile).then((duration) => {
        if (duration > 15) {
          setValidationError('Video too long. Please upload videos under 15 seconds.')
        }
      }).catch(() => {
        setValidationError('Could not determine video duration')
      })
    }
  }

  const handleUploadAndCreate = async () => {
    if (!file || !selectedCategory) return

    try {
      // Step 1: Upload video to IPFS
      console.log('Starting IPFS upload...')
      const result = await uploadBattleVideo(file, selectedCategory, title || undefined)
      console.log('IPFS upload successful:', result)
      setUploadResult(result)
      
      // Step 2: Automatically create battle after successful upload
      await handleCreateBattle(result)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleCreateBattle = async (uploadResult: { videoHash: string; videoUrl: string; metadataHash?: string }) => {
    if (!isConnected || !address || !isRegistered) {
      return
    }

    try {
      // Create battle with the uploaded video
      const battleData = {
        category: selectedCategory,
        ipfsHash1: uploadResult.videoHash,
        entryFee: parseUnits(entryFee || "10", 18),
      }

      console.log('Creating battle with data:', battleData)
      const battleId = await createNewBattle(battleData)
      console.log('Battle created successfully with ID:', battleId)
      
      // Navigate to battle page on success
      setTimeout(() => {
        router.push(`/battles/${battleId}?tab=challenge`)
      }, 2000)

    } catch (err) {
      console.error('Battle creation failed:', err)
    }
  }

  const handleRetry = () => {
    resetState()
    setUploadResult(null)
    setFile(null)
    setTitle("")
    setDescription("")
    setSelectedCategory("")
    setEntryFee("10")
    clearError()
  }

  // Get user-friendly step message
  const getStepMessage = () => {
    switch (currentStep) {
      case 'checking-registration':
        return 'Checking registration status...'
      case 'checking-allowance':
        return 'Checking token allowance...'
      case 'approving-tokens':
        return 'Approving CLASH tokens...'
      case 'creating-battle':
        return 'Creating battle...'
      case 'waiting-confirmation':
        return 'Waiting for blockchain confirmation...'
      case 'success':
        return 'Battle created successfully!'
      case 'error':
        return 'An error occurred'
      default:
        return ''
    }
  }

  const isProcessing = isUploading || isCreating
  const canSubmit = !isProcessing && file && selectedCategory && !validationError && 
                    isConnected && isRegistered && entryFee && parseFloat(entryFee) >= 10

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create Battle</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload your 15-second performance</CardTitle>
          <CardDescription>
            Your clip will be stored on IPFS with metadata on the Base blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed rounded-lg p-6">
            {isUploading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Uploading to IPFS...</span>
                </div>
                <Progress value={uploadProgress?.percentage || 0} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {uploadProgress?.percentage || 0}% - {Math.round((uploadProgress?.loaded || 0) / 1024 / 1024)}MB / 
                  {Math.round((uploadProgress?.total || 0) / 1024 / 1024)}MB
                </p>
              </div>
            ) : uploadResult && (currentStep === 'checking-registration' || currentStep === 'checking-allowance' || isApproving || currentStep === 'creating-battle' || isWaitingConfirmation) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Upload Complete!</span>
                </div>
                
                <div className="max-w-md mx-auto">
                  <IPFSVideoPlayer 
                    ipfsHash={uploadResult.videoHash}
                    className="w-full h-48 rounded-lg"
                    controls
                  />
                </div>

                <div className="space-y-3">
                  {isApproving && (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertTitle>Token Approval Required</AlertTitle>
                      <AlertDescription>
                        Please approve the transaction in your wallet to allow the contract to use your CLASH tokens.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium">{getStepMessage()}</span>
                  </div>

                  {currentStep === 'checking-allowance' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Verifying token approval status...
                    </p>
                  )}
                  
                  {isApproving && (
                    <p className="text-xs text-center text-muted-foreground">
                      Waiting for token approval confirmation...
                    </p>
                  )}
                  
                  {currentStep === 'creating-battle' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Please confirm the battle creation transaction in your wallet
                    </p>
                  )}
                  
                  {isWaitingConfirmation && (
                    <p className="text-xs text-center text-muted-foreground">
                      Transaction submitted. Waiting for blockchain confirmation...
                    </p>
                  )}
                </div>
              </div>
            ) : uploadResult && currentStep === 'success' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Swords className="h-6 w-6" />
                  <span className="font-bold text-lg">Battle Created Successfully!</span>
                </div>
                
                <div className="max-w-md mx-auto">
                  <IPFSVideoPlayer 
                    ipfsHash={uploadResult.videoHash}
                    className="w-full h-48 rounded-lg"
                    controls
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your battle...
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            ) : uploadResult && currentStep === 'error' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Battle Creation Failed</span>
                </div>
                
                <div className="max-w-md mx-auto">
                  <IPFSVideoPlayer 
                    ipfsHash={uploadResult.videoHash}
                    className="w-full h-48 rounded-lg"
                    controls
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Drag and drop your video file</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    MP4, MOV or WebM format, max 15 seconds, up to 50MB
                  </p>
                </div>
                <Button asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm,video/quicktime" 
                      className="hidden" 
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} 
                    />
                  </label>
                </Button>
                {file && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {Math.round(file.size / 1024 / 1024)}MB
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Errors */}
          {validationError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Invalid File</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
              
              {(uploadError.includes('403') || uploadError.includes('401') || uploadError.includes('credentials')) && (
                <IPFSConfigHelper />
              )}
            </div>
          )}

          {battleError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Battle Creation Failed</AlertTitle>
              <AlertDescription>{battleError}</AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input 
                id="title" 
                placeholder="Give your clip a catchy title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isProcessing}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="singing">Singing</SelectItem>
                  <SelectItem value="rapping">Rapping</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="dancing">Dancing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="entryFee">Entry Fee ($CLASH) *</Label>
              <div className="flex gap-2">
                <Input 
                  id="entryFee" 
                  type="number" 
                  min="10" 
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  placeholder="10"
                  disabled={isProcessing}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEntryFee("10")}
                  disabled={isProcessing}
                >
                  Min
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEntryFee("50")}
                  disabled={isProcessing}
                >
                  High
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum entry fee: 10 $CLASH
              </p>
              {entryFee && parseFloat(entryFee) < 10 && (
                <p className="text-xs text-red-500">
                  Entry fee must be at least 10 $CLASH
                </p>
              )}
            </div>
          </div>

          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to create a battle
              </AlertDescription>
            </Alert>
          )}

          {isConnected && !isRegistered && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Required</AlertTitle>
              <AlertDescription>
                Please complete your registration before creating battles
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Badge variant="outline">Entry Fee: {entryFee || '10'} $CLASH</Badge>
            {uploadResult && currentStep !== 'error' && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Uploaded
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {(uploadResult && currentStep === 'error') || (battleError && uploadResult) ? (
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
            ) : null}
            
            <Button 
              onClick={handleUploadAndCreate} 
              disabled={!canSubmit}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : isApproving ? (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Approving Tokens...
                </>
              ) : isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Battle...
                </>
              ) : currentStep === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Success!
                </>
              ) : !isConnected ? (
                "Connect Wallet First"
              ) : !isRegistered ? (
                "Complete Registration First"
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Create Battle
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}