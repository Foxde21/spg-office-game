import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { NPC } from '../objects/NPC'
import { Item } from '../objects/Item'
import { GAME_WIDTH, GAME_HEIGHT } from '../config'
import { InventoryManager } from '../managers/Inventory'
import { SaveManager } from '../managers/Save'
import { GameStateManager } from '../managers/GameState'
import type { ItemData } from '../types'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private npcs: NPC[] = []
  private items: Item[] = []
  private interactKey!: Phaser.Input.Keyboard.Key
  private inventory!: InventoryManager
  private saveManager!: SaveManager
  private gameState!: GameStateManager

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.inventory = InventoryManager.getInstance(this.game)
    this.saveManager = SaveManager.getInstance(this.game)
    this.gameState = GameStateManager.getInstance(this.game)
    this.createOffice()
    this.createPlayer()
    this.createItems()
    this.createNPCs()
    this.setupInput()
    this.setupCamera()

    this.scene.launch('UIScene')
    
    this.loadSavedGame()
    
    this.saveManager.startAutoSave()
    
    this.game.events.on('questCompleted', this.onQuestCompleted, this)
    this.game.events.on('itemAdded', this.onItemAdded, this)
  }

  private onQuestCompleted() {
    this.gameState.setPlayerPosition(this.player.x, this.player.y)
    this.saveManager.save()
  }

  private onItemAdded() {
    this.gameState.setPlayerPosition(this.player.x, this.player.y)
    this.saveManager.save()
  }

  private loadSavedGame() {
    if (this.saveManager.hasSave()) {
      const saveData = this.saveManager.load()
      if (saveData && saveData.player) {
        const pos = this.gameState.getPlayerPosition()
        this.player.setPosition(pos.x, pos.y)
        
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

  private createOffice() {
    const tileSize = 64
    const cols = Math.ceil(GAME_WIDTH * 1.5 / tileSize)
    const rows = Math.ceil(GAME_HEIGHT * 1.5 / tileSize)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isWall = y === 0 || y === rows - 1 || x === 0 || x === cols - 1
        const texture = isWall ? 'wall' : 'floor'
        this.add.sprite(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, texture)
      }
    }

    this.createOfficeObjects()
  }

  private createOfficeObjects() {
    const deskStyle = { fillStyle: { color: 0x8b7355 } }
    
    for (let i = 0; i < 5; i++) {
      const desk = this.add.graphics(deskStyle)
      desk.fillRect(150 + i * 150, 200, 100, 60)
      desk.fillRect(150 + i * 150, 180, 100, 20)
    }

    const coffee = this.add.graphics({ fillStyle: { color: 0x4a3728 } })
    coffee.fillRect(700, 500, 80, 100)
    
    const coffeeLabel = this.add.text(740, 550, '☕', { fontSize: '32px' })
    coffeeLabel.setOrigin(0.5)
  }

  private createItems() {
    const itemsData: Array<{ x: number; y: number; data: ItemData }> = [
      {
        x: 750,
        y: 620,
        data: {
          id: 'coffee-cup',
          name: 'Кофе',
          description: 'Горячий кофе. Снижает стресс.',
          sprite: 'item',
          type: 'consumable',
          usable: true,
          effects: { stress: -15 },
        },
      },
      {
        x: 300,
        y: 500,
        data: {
          id: 'documentation',
          name: 'Документация',
          description: 'Документация по проекту. Квестовый предмет.',
          sprite: 'item',
          type: 'quest',
          usable: false,
        },
      },
      {
        x: 1200,
        y: 300,
        data: {
          id: 'energy-drink',
          name: 'Энергетик',
          description: 'Бодрит! Но потом будет хуже...',
          sprite: 'item',
          type: 'consumable',
          usable: true,
          effects: { stress: -25 },
        },
      },
    ]

    itemsData.forEach(({ x, y, data }) => {
      const item = new Item(this, x, y, data.sprite, data)
      this.items.push(item)
      this.add.existing(item)
    })
  }

  private createPlayer() {
    this.player = new Player(this, 200, 400, 'player')
    this.add.existing(this.player)
  }

  private createNPCs() {
    const npcConfigs = [
      { id: 'tim-lead', x: 600, y: 300, name: 'Тим Лид', role: 'Team Lead' },
      { id: 'anna-hr', x: 900, y: 400, name: 'Анна HR', role: 'HR Manager' },
      { id: 'petya-senior', x: 400, y: 500, name: 'Петя Сеньор', role: 'Senior Developer' },
      { id: 'olga-product', x: 1100, y: 300, name: 'Ольга Продакт', role: 'Product Manager' },
      { id: 'lesha-designer', x: 300, y: 250, name: 'Лёша Дизайнер', role: 'UI/UX Designer' },
      { id: 'masha-qa', x: 800, y: 550, name: 'Маша QA', role: 'QA Engineer' },
      { id: 'igor-analyst', x: 500, y: 600, name: 'Игорь Аналитик', role: 'Business Analyst' },
      { id: 'director', x: 1200, y: 500, name: 'Директор', role: 'CEO' },
    ]

    npcConfigs.forEach(config => {
      const npc = new NPC(
        this,
        config.x,
        config.y,
        'npc',
        config.id,
        config.name,
        config.role,
        [],
        true
      )
      this.npcs.push(npc)
      this.add.existing(npc)
    })
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  }

  private setupCamera() {
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, GAME_WIDTH * 1.5, GAME_HEIGHT * 1.5)
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
}
