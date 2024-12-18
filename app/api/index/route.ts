import { NextResponse } from 'next/server'

const SERVICE_URL = process.env.NEXT_PUBLIC_RAG_SERVICE_URL

export async function POST(request: Request) {
  if (!SERVICE_URL) {
    return NextResponse.json({ error: 'RAG service URL not configured' }, { status: 500 })
  }

  const body = await request.json()

  try {
    const response = await fetch(`${SERVICE_URL}/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to index documents')
    }

    const data = await response.text()
    return NextResponse.json({ message: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred while indexing documents' }, { status: 500 })
  }
}

