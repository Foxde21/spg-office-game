import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { aiRouter } from './routes/ai.js'
import { setupMultiplayer } from './multiplayer.js'

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

app.use(cors({
  origin: CLIENT_URL
}))
app.use(express.json())

app.use('/api/ai', aiRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
})

setupMultiplayer(io)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`WebSocket ready at ws://localhost:${PORT}`)
})
