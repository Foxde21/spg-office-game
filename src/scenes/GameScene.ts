import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { NPC } from '../objects/NPC'
import { Item } from '../objects/Item'
import { Door } from '../objects/Door'
import { InventoryManager } from '../managers/Inventory'
import { LocationManager } from '../managers/LocationManager'
import { STARTING_POSITION } from '../data/locations'
import type { LocationData } from '../types/Location'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private npcs: NPC[] = []
  private items: Item[] = []
  private doors: Door[] = []
  private backgroundTiles: Phaser.GameObjects.Sprite[] = []
  private decorGraphics: Phaser.GameObjects.Graphics | null = null
  private interactKey!: Phaser.Input.Keyboard.Key
  private inventory!: InventoryManager
  private locationManager!: LocationManager

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.inventory = InventoryManager.getInstance(this.game)
    this.locationManager = LocationManager.getInstance(this.game)

    this.createPlayer()
    this.loadLocation(this.locationManager.getCurrentLocationData())
    this.setupInput()
    this.setupCamera()

    this.scene.launch('UIScene')

    this.game.events.on('locationChanged', this.onLocationChanged, this)
  }

  private createPlayer() {
    this.player = new Player(this, STARTING_POSITION.x, STARTING_POSITION.y, 'player')
    this.add.existing(this.player)
    this.player.setDepth(10)
  }

  private loadLocation(location: LocationData) {
    this.clearLocation()
    
    this.createLocationBackground(location)
    this.createLocationObjects(location)
    this.createDoors(location)
    this.createNPCs(location)
    this.createItems(location)
    
    this.cameras.main.setBounds(0, 0, location.width, location.height)
  }

  private clearLocation() {
    this.npcs.forEach((npc) => npc.destroy())
    this.items.forEach((item) => item.destroy())
    this.doors.forEach((door) => door.destroy())
    this.backgroundTiles.forEach((tile) => tile.destroy())
    if (this.decorGraphics) {
      this.decorGraphics.destroy()
      this.decorGraphics = null
    }
    
    this.npcs = []
    this.items = []
    this.doors = []
    this.backgroundTiles = []
  }

  private createLocationBackground(location: LocationData) {
    const tileSize = 64
    const cols = Math.ceil(location.width / tileSize)
    const rows = Math.ceil(location.height / tileSize)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isWall = y === 0 || y === rows - 1 || x === 0 || x === cols - 1
        const texture = isWall ? 'wall' : 'floor'
        const sprite = this.add.sprite(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, texture)
        this.backgroundTiles.push(sprite)
      }
    }

    this.createLocationDecor(location)
  }

  private createLocationDecor(location: LocationData) {
    this.decorGraphics = this.add.graphics()

    if (location.id === 'open-space') {
      for (let i = 0; i < 5; i++) {
        this.decorGraphics.fillStyle(0x8b7355)
        this.decorGraphics.fillRect(150 + i * 150, 200, 100, 60)
        this.decorGraphics.fillRect(150 + i * 150, 180, 100, 20)
      }
    } else if (location.id === 'kitchen') {
      this.decorGraphics.fillStyle(0x4a3728)
      this.decorGraphics.fillRect(500, 300, 120, 80)
      
      this.decorGraphics.fillStyle(0x555555)
      this.decorGraphics.fillRect(800, 350, 60, 100)
      
      const coffeeLabel = this.add.text(560, 340, '☕', { fontSize: '32px' })
      coffeeLabel.setOrigin(0.5)
      coffeeLabel.setName('decor-label')
      this.backgroundTiles.push(coffeeLabel as any)
    } else if (location.id === 'meeting-room') {
      this.decorGraphics.fillStyle(0x5a4a3a)
      this.decorGraphics.fillRect(400, 250, 200, 100)
      
      this.decorGraphics.fillStyle(0x4a4a5a)
      this.decorGraphics.fillRect(200, 150, 80, 60)
    } else if (location.id === 'director-office') {
      this.decorGraphics.fillStyle(0x6a5a4a)
      this.decorGraphics.fillRect(500, 150, 200, 80)
      
      this.decorGraphics.fillStyle(0x4a5a6a)
      this.decorGraphics.fillRect(900, 200, 80, 60)
    }
  }

  private createLocationObjects(_location: LocationData) {
  }

  private createDoors(location: LocationData) {
    location.doors.forEach((doorData) => {
      const door = new Door(this, doorData.x, doorData.y, doorData)
      door.setDepth(5)
      this.doors.push(door)
      this.add.existing(door)
    })
  }

  private createNPCs(location: LocationData) {
    location.npcs.forEach((npcData) => {
      const npc = new NPC(
        this,
        npcData.x,
        npcData.y,
        npcData.sprite,
        npcData.name,
        npcData.role,
        npcData.dialogues
      )
      npc.setDepth(10)
      this.npcs.push(npc)
      this.add.existing(npc)
    })
  }

  private createItems(location: LocationData) {
    location.items.forEach((itemSpawn) => {
      const item = new Item(this, itemSpawn.x, itemSpawn.y, itemSpawn.data.sprite, itemSpawn.data)
      item.setDepth(10)
      this.items.push(item)
      this.add.existing(item)
    })
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  }

  private setupCamera() {
    this.cameras.main.startFollow(this.player)
    const location = this.locationManager.getCurrentLocationData()
    this.cameras.main.setBounds(0, 0, location.width, location.height)
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors)
    }

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.checkInteraction()
    }
  }

  private checkInteraction() {
    for (const door of this.doors) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        door.x,
        door.y
      )

      if (distance < 80) {
        this.useDoor(door)
        return
      }
    }

    for (const item of this.items) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        item.x,
        item.y
      )

      if (distance < 60) {
        this.pickupItem(item)
        return
      }
    }

    for (const npc of this.npcs) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.x,
        npc.y
      )

      if (distance < 80) {
        this.startDialogue(npc)
        return
      }
    }
  }

  private useDoor(door: Door) {
    const doorData = door.getDoorData()
    this.locationManager.changeLocation(doorData.targetLocation, doorData.spawnX, doorData.spawnY)
  }

  private onLocationChanged(data: { spawnPosition: { x: number; y: number }; locationData: LocationData }) {
    this.player.setPosition(data.spawnPosition.x, data.spawnPosition.y)
    this.loadLocation(data.locationData)
  }

  private pickupItem(item: Item) {
    const itemData = item.getItemData()
    const success = this.inventory.addItem(itemData)

    if (success) {
      const index = this.items.indexOf(item)
      this.items.splice(index, 1)
      item.destroy()
    }
  }

  private startDialogue(npc: NPC) {
    this.scene.pause()
    this.scene.get('UIScene').events.emit('startDialogue', npc.getDialogue())
  }

  shutdown() {
    this.game.events.off('locationChanged', this.onLocationChanged, this)
  }
}
