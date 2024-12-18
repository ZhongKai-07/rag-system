import { NextResponse } from 'next/server'

const RAG_SERVICE_URL = process.env.NEXT_PUBLIC_RAG_SERVICE_URL

export async function POST(request: Request) {
  if (!RAG_SERVICE_URL) {
    return NextResponse.json({ error: 'RAG service URL not configured' }, { status: 500 })
  }

  try {
    const documents = await request.json()

    const response = await fetch(`${RAG_SERVICE_URL}/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documents),
    })

    if (!response.ok) {
      throw new Error('Failed to upload documents to RAG service')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading documents:', error)
    return NextResponse.json({ error: 'An error occurred while uploading documents' }, { status: 500 })
  }
}

