import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { aiRouter } from './routes/ai.js'
import { setupMultiplayer } from './multiplayer.js'
import { networkInterfaces } from 'os'

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 3001

const corsOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
]

const interfaces = networkInterfaces()
for (const name of Object.keys(interfaces)) {
  const ifaces = interfaces[name]
  if (!ifaces) continue
  for (const iface of ifaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      corsOrigins.push(`http://${iface.address}:3000`)
    }
  }
}

app.use(cors({
  origin: corsOrigins
}))
app.use(express.json())

app.use('/api/ai', aiRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST']
  }
})

setupMultiplayer(io)

httpServer.listen(PORT, '0.0.0.0', () => {
  const interfaces = networkInterfaces()
  const addresses: string[] = []
  
  for (const name of Object.keys(interfaces)) {
    const ifaces = interfaces[name]
    if (!ifaces) continue
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address)
      }
    }
  }
  
  console.log(`Server running on:`)
  console.log(`  - http://localhost:${PORT}`)
  addresses.forEach(addr => {
    console.log(`  - http://${addr}:${PORT}`)
  })
  console.log(`WebSocket ready at ws://localhost:${PORT}`)
  addresses.forEach(addr => {
    console.log(`  - ws://${addr}:${PORT}`)
  })
})
