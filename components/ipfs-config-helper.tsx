"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function IPFSConfigHelper() {
  const [showConfig, setShowConfig] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const envExample = `# IPFS Configuration
# Get your API keys from https://app.pinata.cloud/developers
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here`

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>IPFS Configuration Required:</strong> You need to set up IPFS credentials to upload videos. 
          Choose one of the options below.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pinata Option */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Pinata (Recommended)
            </CardTitle>
            <CardDescription>
              Professional IPFS service with reliable pinning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Steps:</Label>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://app.pinata.cloud/developers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pinata Cloud</a></li>
                <li>Sign up or log in</li>
                <li>Create a new API key</li>
                <li>Set permissions: pinFileToIPFS, pinJSONToIPFS</li>
                <li>Copy your API Key and Secret Key</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <Label>Environment Variables:</Label>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                <div>NEXT_PUBLIC_PINATA_API_KEY=your_key</div>
                <div>NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret</div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => copyToClipboard(envExample)}
              className="w-full"
            >
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy Environment Template
            </Button>
          </CardContent>
        </Card>

        {/* Web3.Storage Option */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Web3.Storage (Alternative)
            </CardTitle>
            <CardDescription>
              Free IPFS service with generous limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Steps:</Label>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://web3.storage/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Web3.Storage</a></li>
                <li>Sign up with GitHub or email</li>
                <li>Go to "API Tokens"</li>
                <li>Create a new token</li>
                <li>Copy the token</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <Label>Environment Variable:</Label>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => copyToClipboard('NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token_here')}
              className="w-full"
            >
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy Environment Variable
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Quick Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>After getting your API credentials:</Label>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Create a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root</li>
              <li>Add your environment variables to the file</li>
              <li>Restart your development server (<code className="bg-muted px-1 rounded">npm run dev</code>)</li>
              <li>Try uploading a video again</li>
            </ol>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">File: .env.local</Badge>
            <Badge variant="outline">Location: Project Root</Badge>
            <Badge variant="outline">Restart Required</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Testing Option */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testing Without API Keys</CardTitle>
          <CardDescription>
            For development and testing purposes only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If you want to test the upload functionality without setting up API keys, 
              you can use the public IPFS fallback:
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-sm">
              NEXT_PUBLIC_USE_PUBLIC_IPFS=true
            </div>
            <p className="text-xs text-muted-foreground">
              Note: This will use a mock upload for testing. Videos won't be permanently stored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
