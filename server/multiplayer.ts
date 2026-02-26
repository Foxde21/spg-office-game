import { Server as SocketIOServer } from 'socket.io'

export interface PlayerInfo {
  id: string
  name: string
  x: number
  y: number
  location: string
  careerPath?: string
  careerLevel?: string
  sprite: string
}

interface ServerPlayer extends PlayerInfo {
  socketId: string
  lastUpdate: number
}

const MAX_PLAYERS = parseInt(process.env.MAX_PLAYERS || '20', 10)
const PLAYER_TIMEOUT = 30000

const players = new Map<string, ServerPlayer>()

export function setupMultiplayer(io: SocketIOServer): void {
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`)

    socket.on('player:join', (data: { name: string; sprite: string; x: number; y: number; location: string; careerPath?: string; careerLevel?: string }) => {
      if (players.size >= MAX_PLAYERS) {
        socket.emit('error', { message: 'Server is full' })
        socket.disconnect()
        return
      }

      const player: ServerPlayer = {
        id: socket.id,
        socketId: socket.id,
        name: data.name,
        x: data.x,
        y: data.y,
        location: data.location,
        sprite: data.sprite,
        careerPath: data.careerPath,
        careerLevel: data.careerLevel,
        lastUpdate: Date.now()
      }

      players.set(socket.id, player)

      const publicPlayer = getPublicPlayerInfo(player)
      socket.emit('players:list', Array.from(players.values()).map(getPublicPlayerInfo))

      socket.broadcast.emit('player:joined', publicPlayer)

      console.log(`Player joined: ${data.name} (${socket.id}). Total: ${players.size}`)
    })

    socket.on('player:move', (data: { x: number; y: number }) => {
      const player = players.get(socket.id)
      if (!player) return

      player.x = data.x
      player.y = data.y
      player.lastUpdate = Date.now()

      socket.broadcast.emit('player:moved', {
        id: socket.id,
        x: data.x,
        y: data.y
      })
    })

    socket.on('player:location', (data: { location: string }) => {
      const player = players.get(socket.id)
      if (!player) return

      player.location = data.location

      socket.broadcast.emit('player:location_changed', {
        id: socket.id,
        location: data.location
      })
    })

    socket.on('player:update', (data: Partial<PlayerInfo>) => {
      const player = players.get(socket.id)
      if (!player) return

      if (data.x !== undefined) player.x = data.x
      if (data.y !== undefined) player.y = data.y
      if (data.location !== undefined) player.location = data.location
      if (data.careerPath !== undefined) player.careerPath = data.careerPath
      if (data.careerLevel !== undefined) player.careerLevel = data.careerLevel

      player.lastUpdate = Date.now()

      socket.broadcast.emit('player:updated', getPublicPlayerInfo(player))
    })

    socket.on('disconnect', () => {
      const player = players.get(socket.id)
      if (player) {
        players.delete(socket.id)
        socket.broadcast.emit('player:left', { id: socket.id, name: player.name })
        console.log(`Player disconnected: ${player.name} (${socket.id}). Total: ${players.size}`)
      }
    })
  })

  setInterval(() => {
    const now = Date.now()
    const timedOut: string[] = []

    players.forEach((player, id) => {
      if (now - player.lastUpdate > PLAYER_TIMEOUT) {
        timedOut.push(id)
      }
    })

    timedOut.forEach((id) => {
      const player = players.get(id)
      if (player) {
        players.delete(id)
        io.emit('player:left', { id, name: player.name })
        console.log(`Player timeout: ${player.name} (${id})`)
      }
    })
  }, PLAYER_TIMEOUT / 2)
}

function getPublicPlayerInfo(player: ServerPlayer): PlayerInfo {
  return {
    id: player.id,
    name: player.name,
    x: player.x,
    y: player.y,
    location: player.location,
    sprite: player.sprite,
    careerPath: player.careerPath,
    careerLevel: player.careerLevel
  }
}
