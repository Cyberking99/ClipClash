"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IPFSVideoPlayerProps {
  ipfsHash: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
  muted?: boolean
  poster?: string
  onLoadStart?: () => void
  onLoadEnd?: () => void
  onError?: (error: string) => void
}

export function IPFSVideoPlayer({
  ipfsHash,
  className,
  autoPlay = false,
  controls = true,
  muted = false,
  poster,
  onLoadStart,
  onLoadEnd,
  onError
}: IPFSVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Generate IPFS URL
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
  const fallbackUrl = `https://ipfs.io/ipfs/${ipfsHash}`

  // Handle video load
  const handleLoadStart = () => {
    setIsLoading(true)
    setError(null)
    onLoadStart?.()
  }

  const handleLoadedMetadata = () => {
    setIsLoading(false)
    setDuration(videoRef.current?.duration || 0)
    onLoadEnd?.()
  }

  const handleError = () => {
    setIsLoading(false)
    const errorMessage = 'Failed to load video'
    setError(errorMessage)
    onError?.(errorMessage)
  }

  // Play/pause controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  // Progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const width = rect.width
      const percentage = clickX / width
      const newTime = percentage * duration
      
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Update current time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded-lg", className)}>
        <div className="text-center p-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-muted-foreground mb-2">Failed to load video</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setError(null)
              setIsLoading(true)
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative bg-black rounded-lg overflow-hidden group", className)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={ipfsUrl}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        onLoadStart={handleLoadStart}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
        preload="metadata"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      {controls && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={togglePlay}
            className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 text-white"
          >
            <Play className="h-6 w-6 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Simple video display component for battle cards
export function IPFSVideoThumbnail({ 
  ipfsHash, 
  className 
}: { 
  ipfsHash: string
  className?: string 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`

  return (
    <div className={cn("relative bg-muted rounded-lg overflow-hidden", className)}>
      {!error ? (
        <video
          src={ipfsUrl}
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
          className="w-full h-full object-cover"
          muted
          preload="metadata"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-muted">
          <div className="text-center p-4">
            <div className="text-muted-foreground mb-2">🎬</div>
            <p className="text-xs text-muted-foreground">Video unavailable</p>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  )
}
