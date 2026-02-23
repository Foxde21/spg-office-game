import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { aiRouter } from './routes/ai.js'

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}))
app.use(express.json())

app.use('/api/ai', aiRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
