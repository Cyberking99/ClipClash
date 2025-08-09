"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, Mic, Music, ThumbsUp, Upload, Users, Video } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("")

  // Mock function to simulate upload
  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create Content</h1>
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-1">
            <Upload className="h-4 w-4" />
            Upload Clip
          </TabsTrigger>
          <TabsTrigger value="challenge" className="gap-1">
            <Users className="h-4 w-4" />
            Challenge Creator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload your 15-second performance</CardTitle>
              <CardDescription>Your clip will be stored on IPFS with metadata on the Base blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Drag and drop your video file</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        MP4, MOV or WebM format, max 15 seconds, up to 50MB
                      </p>
                    </div>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Uploading costs 5 $CLASH tokens to prevent spam. This fee is used to cover storage costs and
                  contribute to the reward pool.
                </AlertDescription>
              </Alert>

              {/* Clip Details */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Give your clip a catchy title" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your performance (optional)" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singing">
                        <div className="flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Singing
                        </div>
                      </SelectItem>
                      <SelectItem value="rapping">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          Rapping
                        </div>
                      </SelectItem>
                      <SelectItem value="comedy">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          Comedy
                        </div>
                      </SelectItem>
                      <SelectItem value="dancing">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Dancing
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Clip Duration</Label>
                  <div className="flex items-center gap-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Slider defaultValue={[15]} max={15} step={1} className="flex-1" />
                    <span className="font-mono w-12 text-right">15s</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All clips must be exactly 15 seconds for fair competition
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="enter-battles" />
                    <Label htmlFor="enter-battles">Enter into battles immediately</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-derivatives" />
                    <Label htmlFor="allow-derivatives">Allow derivative works</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <Badge variant="outline" className="gap-1">
                  Cost: 5 $CLASH
                </Badge>
              </div>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload to IPFS"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenge" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenge another creator</CardTitle>
              <CardDescription>Stake $CLASH tokens to challenge specific performers to a battle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="creator">Creator Username</Label>
                <Input id="creator" placeholder="@username" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
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
                <Label htmlFor="stake">Stake Amount ($CLASH)</Label>
                <div className="flex gap-2">
                  <Input id="stake" type="number" min="10" defaultValue="50" />
                  <Button variant="outline">Max</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum stake: 10 $CLASH. Higher stakes attract more attention!
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Challenge Message</Label>
                <Textarea id="message" placeholder="Write a message to the creator you're challenging" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiry">Challenge Expiry</Label>
                <Select defaultValue="48">
                  <SelectTrigger id="expiry">
                    <SelectValue placeholder="Select expiry time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  If not accepted within this time, your stake will be returned
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Send Challenge</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
