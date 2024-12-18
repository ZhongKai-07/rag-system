'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocumentUploader() {
  const [documents, setDocuments] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadStatus('Uploading...')

    const docs = documents.split('\n').map(doc => ({ text: doc.trim() })).filter(doc => doc.text)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docs),
      })

      if (!response.ok) {
        throw new Error('Failed to upload documents')
      }

      const result = await response.json()
      setUploadStatus(`Upload successful: ${result.message}`)
      setDocuments('')
    } catch (error) {
      console.error('Error:', error)
      setUploadStatus('Upload failed. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Upload Initial Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <Textarea
            value={documents}
            onChange={(e) => setDocuments(e.target.value)}
            placeholder="Enter documents, one per line"
            className="min-h-[100px]"
          />
          <Button type="submit">Upload Documents</Button>
        </form>
        {uploadStatus && <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>}
      </CardContent>
    </Card>
  )
}

