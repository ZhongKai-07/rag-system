'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  role: 'user' | 'system'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [topK, setTopK] = useState(3)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, top_k: topK }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response')
      }

      const data = await response.json()
      const systemMessage: Message = { role: 'system', content: data.response }
      setMessages(prev => [...prev, systemMessage])

      // Add conversation to the database
      await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { text: `User: ${userMessage.content}` },
          { text: `System: ${systemMessage.content}` }
        ]),
      })
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'system', content: 'Sorry, an error occurred. Please try again.' }])
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="mb-4">
        <CardContent className="p-4 h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {message.content}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-grow"
        />
        <Input
          type="number"
          value={topK}
          onChange={(e) => setTopK(Number(e.target.value))}
          placeholder="Top K"
          className="w-20"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}

