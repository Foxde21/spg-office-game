import { Router } from 'express'

export const aiRouter = Router()

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIRequest {
  messages: ChatMessage[]
  model?: string
}

aiRouter.post('/chat', async (req, res) => {
  try {
    const { messages, model = 'meta-llama/llama-3.1-8b-instruct:free' } = req.body as AIRequest
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
        'X-Title': 'Office Quest Game'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter error:', error)
      return res.status(response.status).json({ error: 'AI request failed' })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    res.json({ content })
  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
