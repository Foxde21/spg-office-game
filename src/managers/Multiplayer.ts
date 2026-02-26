import Phaser from 'phaser'
import { io, type Socket } from 'socket.io-client'
import type { PlayerInfo } from '../../server/multiplayer'

declare global {
  interface ImportMeta {
    env: Record<string, string>
  }
}

export class RemotePlayer extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite
  private nameLabel: Phaser.GameObjects.Text
  private levelBadge?: Phaser.GameObjects.Text
  private targetX: number
  private targetY: number
  private playerId: string

  constructor(scene: Phaser.Scene, playerInfo: PlayerInfo) {
    super(scene, playerInfo.x, playerInfo.y)

    this.playerId = playerInfo.id
    this.targetX = playerInfo.x
    this.targetY = playerInfo.y

    this.sprite = scene.add.sprite(0, 0, playerInfo.sprite || 'player')
    this.sprite.setScale(1)

    this.nameLabel = scene.add.text(0, -40, playerInfo.name, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 }
    })
    this.nameLabel.setOrigin(0.5, 1)

    if (playerInfo.careerLevel) {
      this.levelBadge = scene.add.text(0, 40, playerInfo.careerLevel, {
        fontSize: '12px',
        color: '#ffff00'
      })
      this.levelBadge.setOrigin(0.5, 0)
      this.add(this.levelBadge)
    }

    this.add([this.sprite, this.nameLabel])
    this.setDepth(10)
    scene.add.existing(this)
  }

  getPlayerId(): string {
    return this.playerId
  }

  updatePosition(x: number, y: number): void {
    this.targetX = x
    this.targetY = y
  }

  updateInfo(info: Partial<PlayerInfo>): void {
    if (info.x !== undefined && info.y !== undefined) {
      this.updatePosition(info.x, info.y)
    }
    if (info.name !== undefined) {
      this.nameLabel.setText(info.name)
    }
    if (info.careerLevel !== undefined) {
      if (!this.levelBadge) {
        this.levelBadge = this.scene.add.text(0, 40, info.careerLevel, {
          fontSize: '12px',
          color: '#ffff00'
        })
        this.levelBadge.setOrigin(0.5, 0)
        this.add(this.levelBadge)
      } else {
        this.levelBadge.setText(info.careerLevel)
      }
    }
  }

  updateView(): void {
    this.x = Phaser.Math.Linear(this.x, this.targetX, 0.15)
    this.y = Phaser.Math.Linear(this.y, this.targetY, 0.15)
  }
}

export class MultiplayerManager {
  private static instance: MultiplayerManager
  private game: Phaser.Game
  private socket: Socket | null = null
  private remotePlayers: Map<string, RemotePlayer> = new Map()
  private connected = false
  private lastSendTime = 0
  private currentLocation = ''
  private playerId = ''
  private maxRetries = 10

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): MultiplayerManager {
    if (!MultiplayerManager.instance && game) {
      MultiplayerManager.instance = new MultiplayerManager(game)
    }
    return MultiplayerManager.instance
  }

  connect(playerName: string, sprite: string, startLocation: string, x: number, y: number): void {
    if (this.connected || this.socket) return

    this.currentLocation = startLocation

    const serverUrl = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3001'

    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxRetries
    })

    this.socket.on('connect', () => {
      console.log(`Connected to multiplayer server: ${this.socket?.id}`)
      this.playerId = this.socket?.id || ''
      this.connected = true

      this.socket?.emit('player:join', {
        name: playerName,
        sprite: sprite,
        x: x,
        y: y,
        location: startLocation
      })

      this.game.events.emit('multiplayerConnected', { playerId: this.playerId })
    })

    this.socket.on('players:list', (players: PlayerInfo[]) => {
      console.log(`[Multiplayer] Received players list:`, players)
      this.createRemotePlayersFromList(players)
    })

    this.socket.on('player:joined', (playerInfo: PlayerInfo) => {
      console.log(`[Multiplayer] Player joined:`, playerInfo)
      if (playerInfo.id !== this.playerId) {
        this.createRemotePlayer(playerInfo)
        this.game.events.emit('remotePlayerJoined', playerInfo)
      }
    })

    this.socket.on('player:moved', (data: { id: string; x: number; y: number }) => {
      const player = this.remotePlayers.get(data.id)
      if (player) {
        player.updatePosition(data.x, data.y)
      }
    })

    this.socket.on('player:location_changed', (data: { id: string; location: string }) => {
      const player = this.remotePlayers.get(data.id)
      if (player) {
        player.destroy()
        this.remotePlayers.delete(data.id)
        this.game.events.emit('remotePlayerLeft', { id: data.id })
      }
    })

    this.socket.on('player:updated', (playerInfo: PlayerInfo) => {
      const player = this.remotePlayers.get(playerInfo.id)
      if (player) {
        player.updateInfo(playerInfo)
      }
    })

    this.socket.on('player:left', (data: { id: string; name: string }) => {
      const player = this.remotePlayers.get(data.id)
      if (player) {
        player.destroy()
        this.remotePlayers.delete(data.id)
      }
      this.game.events.emit('remotePlayerLeft', data)
    })

    this.socket.on('error', (data: { message: string }) => {
      console.error('Multiplayer error:', data.message)
      this.connected = false
      this.game.events.emit('multiplayerError', data)
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from multiplayer server')
      this.connected = false
      this.game.events.emit('multiplayerDisconnected')
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.connected = false
    this.remotePlayers.forEach((player) => player.destroy())
    this.remotePlayers.clear()
  }

  isConnected(): boolean {
    return this.connected
  }

  sendPosition(x: number, y: number): void {
    if (!this.connected || !this.socket) return

    const now = Date.now()
    if (now - this.lastSendTime < 50) return

    this.lastSendTime = now
    this.socket.emit('player:move', { x, y })
  }

  sendLocationChange(locationId: string): void {
    if (!this.connected || !this.socket) return

    this.currentLocation = locationId
    this.remotePlayers.forEach((player) => player.destroy())
    this.remotePlayers.clear()

    this.socket.emit('player:location', { location: locationId })
  }

  updatePlayerInfo(data: Partial<PlayerInfo>): void {
    if (!this.connected || !this.socket) return

    this.socket.emit('player:update', data)
  }

  getPlayersInLocation(): RemotePlayer[] {
    return Array.from(this.remotePlayers.values())
  }

  getRemotePlayer(playerId: string): RemotePlayer | undefined {
    return this.remotePlayers.get(playerId)
  }

  updateRemotePlayersView(): void {
    this.remotePlayers.forEach((player) => player.updateView())
  }

  private createRemotePlayersFromList(players: PlayerInfo[]): void {
    players.forEach((playerInfo) => {
      if (playerInfo.id !== this.playerId && playerInfo.location === this.currentLocation) {
        console.log(`[Multiplayer] Creating remote player from list:`, playerInfo)
        this.createRemotePlayer(playerInfo)
      }
    })
  }

  private createRemotePlayer(playerInfo: PlayerInfo): void {
    if (this.remotePlayers.has(playerInfo.id)) return

    const gameScene = this.game.scene.getScene('GameScene') as Phaser.Scene | undefined
    const isSceneActive = gameScene && this.game.scene.isActive('GameScene')
    
    console.log(`[Multiplayer] Creating remote player - Scene check:`, { 
      sceneExists: !!gameScene, 
      sceneActive: isSceneActive,
      playerId: playerInfo.id 
    })
    
    if (!gameScene || !isSceneActive) {
      console.warn(`[Multiplayer] Cannot create remote player - scene not active`)
      return
    }

    const remotePlayer = new RemotePlayer(gameScene, playerInfo)
    this.remotePlayers.set(playerInfo.id, remotePlayer)
    console.log(`[Multiplayer] Remote player created:`, playerInfo.name)
  }

  clear(): void {
    this.remotePlayers.forEach((player) => player.destroy())
    this.remotePlayers.clear()
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.connected = false
  }
}
