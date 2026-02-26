import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { NPC } from '../objects/NPC'
import { Item } from '../objects/Item'
import { Door } from '../objects/Door'
import { InventoryManager } from '../managers/Inventory'
import { LocationManager } from '../managers/LocationManager'
import { SaveManager } from '../managers/Save'
import { GameStateManager } from '../managers/GameState'
import { STARTING_POSITION } from '../data/locations'
import type { LocationData, ItemData } from '../types'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private moveInput = {
    left: false,
    right: false,
    up: false,
    down: false
  }
  private npcs: NPC[] = []
  private items: Item[] = []
  private doors: Door[] = []
  private backgroundTiles: Phaser.GameObjects.Sprite[] = []
  private decorImages: Phaser.GameObjects.Image[] = []
  private decorColliders!: Phaser.Physics.Arcade.StaticGroup
  private decorGraphics: Phaser.GameObjects.Graphics | null = null
  private interactKey!: Phaser.Input.Keyboard.Key
  private moveBindings!: { left: string; right: string; up: string; down: string }
  private inventory!: InventoryManager
  private locationManager!: LocationManager
  private saveManager!: SaveManager
  private gameState!: GameStateManager

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.inventory = InventoryManager.getInstance(this.game)
    this.locationManager = LocationManager.getInstance(this.game)
    this.saveManager = SaveManager.getInstance(this.game)
    this.gameState = GameStateManager.getInstance(this.game)
    
    this.decorColliders = this.physics.add.staticGroup()
    this.createPlayer()
    this.loadLocation(this.locationManager.getCurrentLocationData())
    this.physics.add.collider(this.player, this.decorColliders)
    this.setupInput()
    this.setupCamera()

    this.scene.launch('UIScene')

    this.loadSavedGame()
    this.ensurePlayerNotStuckInDecor()

    this.saveManager.startAutoSave()
    
    this.game.events.on('locationChanged', this.onLocationChanged, this)
    this.game.events.on('questCompleted', this.onQuestCompleted, this)
    this.game.events.on('itemAdded', this.onItemAdded, this)
    this.events.on('resume', this.applySettingsFromStorage, this)
  }

  private applySettingsFromStorage() {
    this.moveInput.left = false
    this.moveInput.right = false
    this.moveInput.up = false
    this.moveInput.down = false

    const stored = localStorage.getItem('bindings')
    const defaults = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown'
    }
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { left?: string; right?: string; up?: string; down?: string }
        this.moveBindings = {
          left: parsed.left || defaults.left,
          right: parsed.right || defaults.right,
          up: parsed.up || defaults.up,
          down: parsed.down || defaults.down
        }
      } catch {}
    }
    const savedVol = localStorage.getItem('volume')
    if (savedVol) {
      const vol = parseFloat(savedVol)
      if (!isNaN(vol)) {
        try {
          if ((this.sound as any)?.setVolume) (this.sound as any).setVolume(vol)
        } catch {}
      }
    }
  }

  private onQuestCompleted() {
    this.gameState.setPlayerPosition(this.player.x, this.player.y)
    this.saveManager.save()
  }

  private onItemAdded() {
    this.gameState.setPlayerPosition(this.player.x, this.player.y)
    this.saveManager.save()
  }

  private ensurePlayerNotStuckInDecor() {
    const location = this.locationManager.getCurrentLocationData()
    if (location.id === 'open-space') {
      this.player.setPosition(STARTING_POSITION.x, STARTING_POSITION.y)
      this.gameState.setPlayerPosition(STARTING_POSITION.x, STARTING_POSITION.y)
      return
    }
    if (this.decorColliders.getLength() > 0 && this.physics.overlap(this.player, this.decorColliders)) {
      this.player.setPosition(STARTING_POSITION.x, STARTING_POSITION.y)
      this.gameState.setPlayerPosition(STARTING_POSITION.x, STARTING_POSITION.y)
    }
  }

  private loadSavedGame() {
    if (this.saveManager.hasSave()) {
      const saveData = this.saveManager.load()
      if (saveData && saveData.player) {
        const pos = this.gameState.getPlayerPosition()
        const bounds = this.locationManager.getCurrentLocationData()
        const inBounds = pos.x >= 0 && pos.x <= bounds.width && pos.y >= 0 && pos.y <= bounds.height
        this.player.setPosition(pos.x, pos.y)
        let useDefault = !inBounds
        if (inBounds && this.physics.overlap(this.player, this.decorColliders)) useDefault = true
        if (useDefault) {
          this.player.setPosition(STARTING_POSITION.x, STARTING_POSITION.y)
          this.gameState.setPlayerPosition(STARTING_POSITION.x, STARTING_POSITION.y)
        }

        const inventoryItemIds = saveData.inventory.map(item => item.id)
        this.items = this.items.filter(item => {
          const itemData = item.getItemData()
          if (inventoryItemIds.includes(itemData.id)) {
            item.destroy()
            return false
          }
          return true
        })
      }
    }
  }

  private createPlayer() {
    this.player = new Player(this, STARTING_POSITION.x, STARTING_POSITION.y)
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
    this.decorColliders.clear(true, true)
    this.decorImages.forEach((img) => img.destroy())
    this.decorImages = []
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
        sprite.setDepth(0)
        this.backgroundTiles.push(sprite)
      }
    }

    this.createLocationDecor(location)
  }

  private createLocationDecor(location: LocationData) {
    this.decorGraphics = this.add.graphics()
    this.decorGraphics.setDepth(0)

    if (location.id === 'open-space') {
      this.createOpenSpaceDecor()
    } else if (location.id === 'kitchen') {
      this.createKitchenDecor()
    } else if (location.id === 'meeting-room') {
      this.createMeetingRoomDecor()
    } else if (location.id === 'director-office') {
      this.createDirectorOfficeDecor()
    }
  }

  private addSolid(
    x: number, y: number, frame: string,
    w: number, h: number, scale: number,
    shrinkY = 20, flipY = false, flipX = false
  ) {
    const img = this.add.image(x, y, 'pixeloffice', frame)
    img.setDisplaySize(w * scale, h * scale)
    if (flipY) img.setFlipY(true)
    if (flipX) img.setFlipX(true)
    img.setDepth(2)
    this.physics.add.existing(img, true)
    const body = (img.body as Phaser.Physics.Arcade.StaticBody)
    const dw = img.displayWidth
    const dh = img.displayHeight
    const newH = Math.max(dh - shrinkY, 8)
    body.setSize(dw, newH)
    body.setOffset(0, (dh - newH) / 2)
    this.decorColliders.add(img)
  }

  private addDecor(
    x: number, y: number, frame: string,
    w: number, h: number, scale: number,
    depth = 1, flipY = false, flipX = false
  ) {
    const img = this.add.image(x, y, 'pixeloffice', frame)
    img.setDisplaySize(w * scale, h * scale)
    if (flipY) img.setFlipY(true)
    if (flipX) img.setFlipX(true)
    img.setDepth(depth)
    this.decorImages.push(img)
  }

  private createOpenSpaceDecor() {
    const S_PART_DESK = 3
    const S_COMP = 2
    const partW = 84
    const partH = 20
    const deskPairW = 44
    const deskPairH = 30
    const compW = 20
    const compH = 22
    const passage = 90
    const partDisplayW = partW * S_PART_DESK
    const totalPartRow = 3 * partDisplayW + 2 * passage
    const centerStartX = (1280 - totalPartRow) / 2 + partDisplayW / 2
    const colX = [
      centerStartX,
      centerStartX + partDisplayW + passage,
      centerStartX + (partDisplayW + passage) * 2,
    ]

    const partRowY: number[] = [210, 302, 394]
    const deskRowY: number[] = [235, 327, 419]
    const computerOffsetX = -36
    const computerOffsetY: number[] = [6, 6, 6]

    partRowY.forEach((y) => {
      colX.forEach((x) => this.addSolid(x, y, 'partition', partW, partH, S_PART_DESK))
    })

    deskRowY.forEach((y, rowIndex) => {
      colX.forEach((x) => {
        this.addSolid(x, y, 'desk_pair', deskPairW, deskPairH, S_PART_DESK, 20, true)
        this.addSolid(x + computerOffsetX, y + computerOffsetY[rowIndex], 'computer', compW, compH, S_COMP)
      })
    })

    const rightDeskOffsetY = 5
    const rightDeskOffsetX = 28
    deskRowY.forEach((rowY) => {
      colX.forEach((x) => {
        this.addSolid(x + rightDeskOffsetX, rowY + rightDeskOffsetY, 'computer2', compW, compH, S_COMP, 20, false, true)
      })
    })
  }

  private createKitchenDecor() {
    const S = 3
    const cx = 640

    this.addSolid(cx, 260, 'blue_partition', 73, 24, 2.5, 14)
    this.addSolid(cx - 110, 300, 'desk_big', 44, 20, S, 10)
    this.addSolid(cx + 110, 300, 'desk_big', 44, 20, S, 10)

    this.addDecor(cx - 110, 268, 'chair', 11, 22, 2.5, 2)
    this.addDecor(cx - 110, 340, 'chair', 11, 22, 2.5, 2, true)
    this.addDecor(cx + 110, 268, 'chair', 11, 22, 2.5, 2)
    this.addDecor(cx + 110, 340, 'chair', 11, 22, 2.5, 2, true)

    this.addSolid(200, 220, 'vending_machine', 24, 34, 3, 14)
    this.addSolid(310, 220, 'vending_red', 24, 31, 3, 14)

    this.addSolid(1020, 220, 'desk_big', 44, 20, 3.5, 10)
    this.addSolid(1020, 278, 'shelf_small', 11, 8, 4, 6)
    this.addSolid(1020, 318, 'shelf_small', 11, 8, 4, 6)

    this.addSolid(860, 235, 'water_cooler', 9, 17, 3.5, 6)

    this.addDecor(420, 140, 'plant', 7, 11, 3.5, 2)
    this.addDecor(860, 140, 'plant', 7, 11, 3.5, 2)

    this.addDecor(cx, 76, 'clock_display', 19, 6, 3.5, 1)
    this.addDecor(320, 120, 'window_blue', 26, 21, 3, 1)
    this.addDecor(960, 120, 'window_blue', 26, 21, 3, 1)

    this.addSolid(cx - 180, 440, 'sofa_gray', 33, 15, 3.5, 8)
    this.addSolid(cx + 180, 440, 'sofa_gray', 33, 15, 3.5, 8)

    this.addSolid(cx, 455, 'desk_small', 30, 20, 2.5, 8)

    this.addDecor(665, 468, 'trash_bin', 9, 14, 2.5, 2)
  }

  private createMeetingRoomDecor() {
    const cx = 640

    this.addSolid(580, 312, 'desk_big', 44, 20, 4, 14)
    this.addSolid(cx, 312, 'desk_big', 44, 20, 4, 14)
    this.addSolid(700, 312, 'desk_big', 44, 20, 4, 14)

    const chairY = [272, 352]
    const chairXOffsets = [-120, -60, 0, 60, 120]
    chairXOffsets.forEach((dx) => {
      chairY.forEach((y) => {
        this.addDecor(cx + dx, y, 'chair', 11, 22, 2.5, 2)
      })
    })

    this.addSolid(cx, 140, 'whiteboard', 26, 20, 4.5, 10)
    this.addDecor(cx - 90, 140, 'flag_poster', 12, 9, 3.5, 1)
    this.addDecor(cx + 90, 140, 'flag_poster', 12, 9, 3.5, 1)

    this.addDecor(200, 120, 'window_blue', 26, 21, 3.5, 1)
    this.addDecor(1080, 120, 'window_blue', 26, 21, 3.5, 1)

    this.addDecor(150, 380, 'plant', 7, 11, 4, 2)
    this.addDecor(1130, 380, 'plant', 7, 11, 4, 2)
    this.addDecor(150, 170, 'plant', 7, 11, 4, 2)
    this.addDecor(1130, 170, 'plant', 7, 11, 4, 2)

    this.addSolid(200, 480, 'sofa_blue', 33, 16, 4, 8)
    this.addSolid(1080, 480, 'sofa_blue', 33, 16, 4, 8)

    this.addDecor(cx, 76, 'clock_display', 19, 6, 3.5, 1)
  }

  private createDirectorOfficeDecor() {
    const cx = 640

    this.addSolid(cx, 235, 'desk_big', 44, 20, 5, 14)
    this.addSolid(cx - 65, 224, 'computer', 20, 22, 2.5, 10)

    this.addSolid(280, 205, 'desk_big', 44, 20, 3.5, 10)
    this.addSolid(280, 260, 'shelf_small', 11, 8, 5, 6)
    this.addSolid(280, 300, 'shelf_small', 11, 8, 5, 6)
    this.addSolid(280, 340, 'shelf_small', 11, 8, 5, 6)

    this.addSolid(920, 445, 'sofa_orange', 33, 16, 4, 8)
    this.addDecor(920, 492, 'desk_small', 30, 20, 2.5, 2)

    this.addDecor(200, 120, 'window_blue', 26, 21, 3.5, 1)
    this.addDecor(cx, 120, 'window_blue', 26, 21, 3.5, 1)
    this.addDecor(1080, 120, 'window_blue', 26, 21, 3.5, 1)

    this.addDecor(180, 360, 'plant', 7, 11, 4, 2)
    this.addDecor(1100, 360, 'plant', 7, 11, 4, 2)
    this.addDecor(180, 195, 'plant', 7, 11, 3.5, 2)
    this.addDecor(1100, 195, 'plant', 7, 11, 3.5, 2)

    this.addDecor(cx, 76, 'clock_display', 19, 6, 3.5, 1)
    this.addDecor(920, 138, 'flag_poster', 12, 9, 3.5, 1)

    this.addSolid(880, 208, 'desk_small', 30, 20, 3, 10)
    this.addDecor(880, 196, 'monitor_small', 17, 11, 2.5, 3)
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
    const aiNPCIds = ['tim-lead', 'anna-hr', 'petya-senior', 'olga-product', 'lesha-designer', 'masha-qa', 'igor-analyst', 'director']
    
    location.npcs.forEach((npcData) => {
      const animKey = npcData.sprite
      const npcId = npcData.name.toLowerCase().replace(' ', '-').replace('ё', 'е')
      const isAI = aiNPCIds.includes(npcId)
      
      const npc = new NPC(
        this,
        npcData.x,
        npcData.y,
        animKey,
        npcId,
        npcData.name,
        npcData.role,
        npcData.dialogues,
        isAI
      )
      npc.setDepth(10)
      this.npcs.push(npc)
      this.add.existing(npc)
    })
  }

  private createItems(location: LocationData) {
    location.items.forEach((itemSpawn: { x: number; y: number; data: ItemData }) => {
      const item = new Item(this, itemSpawn.x, itemSpawn.y, itemSpawn.data.sprite, itemSpawn.data)
      item.setDepth(10)
      this.items.push(item)
      this.add.existing(item)
    })
  }

  private setupInput() {
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    const stored = localStorage.getItem('bindings')
    const defaults = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown'
    }

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { left?: string; right?: string; up?: string; down?: string }
        this.moveBindings = {
          left: parsed.left || defaults.left,
          right: parsed.right || defaults.right,
          up: parsed.up || defaults.up,
          down: parsed.down || defaults.down
        }
      } catch {
        this.moveBindings = defaults
      }
    } else {
      this.moveBindings = defaults
    }

    const keyboard = this.input.keyboard
    if (!keyboard) return

    keyboard.on('keydown', (ev: KeyboardEvent) => {
      const code = ev.code
      if (code === this.moveBindings.left) this.moveInput.left = true
      if (code === this.moveBindings.right) this.moveInput.right = true
      if (code === this.moveBindings.up) this.moveInput.up = true
      if (code === this.moveBindings.down) this.moveInput.down = true
    })

    keyboard.on('keyup', (ev: KeyboardEvent) => {
      const code = ev.code
      if (code === this.moveBindings.left) this.moveInput.left = false
      if (code === this.moveBindings.right) this.moveInput.right = false
      if (code === this.moveBindings.up) this.moveInput.up = false
      if (code === this.moveBindings.down) this.moveInput.down = false
    })

    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.on('down', () => {
      if (this.scene.isPaused('GameScene')) return
      this.scene.pause('GameScene')
      this.scene.pause('UIScene')
      this.scene.launch('PauseScene')
      this.scene.bringToTop('PauseScene')
    })
  }

  private setupCamera() {
    this.cameras.main.startFollow(this.player)
    const location = this.locationManager.getCurrentLocationData()
    this.cameras.main.setBounds(0, 0, location.width, location.height)
  }

  update() {
    if (this.player) {
      this.player.update(this.moveInput)
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
    this.game.events.emit('startDialogue', npc.getDialogue())
  }

  shutdown() {
    this.game.events.off('locationChanged', this.onLocationChanged, this)
    this.events.off('resume', this.applySettingsFromStorage, this)
  }
}
