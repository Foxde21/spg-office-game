import Phaser from 'phaser'
import type { Dialogue, DialogueChoice, ItemData, AIContext } from '../types'
import { GameStateManager } from '../managers/GameState'
import { InventoryManager } from '../managers/Inventory'
import { QuestManager } from '../managers/Quest'
import { SaveManager } from '../managers/Save'
import { AIDialogueManager } from '../managers/AIDialogue'
import { LocationManager } from '../managers/LocationManager'
import { CAREER_LEVELS, COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config'

export class UIScene extends Phaser.Scene {
  private dialogueBox!: Phaser.GameObjects.Container
  private dialogueText!: Phaser.GameObjects.Text
  private speakerText!: Phaser.GameObjects.Text
  private choicesContainer!: Phaser.GameObjects.Container
  private currentDialogue: Dialogue | null = null
  private currentLineIndex = 0
  private aiDialogueData: { npcId: string; name: string } | null = null
  private gameState!: GameStateManager
  private inventory!: InventoryManager
  private questManager!: QuestManager
  private saveManager!: SaveManager
  private aiManager!: AIDialogueManager

  private stressBar!: Phaser.GameObjects.Graphics
  private respectBar!: Phaser.GameObjects.Graphics
  private statusText!: Phaser.GameObjects.Text
  private stressWarning!: Phaser.GameObjects.Text

  private inventoryBox!: Phaser.GameObjects.Container
  private inventoryOpen = false
  private inventoryKey!: Phaser.Input.Keyboard.Key
  private saveKey!: Phaser.Input.Keyboard.Key

  private questPanel!: Phaser.GameObjects.Container
  private locationManager!: LocationManager
  private minimapGraphics!: Phaser.GameObjects.Graphics
  private locationNameText!: Phaser.GameObjects.Text
  private minimapLabels: Map<string, Phaser.GameObjects.Text> = new Map()

  private readonly HUD_Y = GAME_HEIGHT - 95
  private readonly HUD_H = 95
  private readonly SECTION_W = 420

  private isAIMode = false
  private aiConversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  private inputField!: Phaser.GameObjects.DOMElement
  private isAITyping = false
  private dialogueHint!: Phaser.GameObjects.Text
  private dialogueAdvanceKey!: Phaser.Input.Keyboard.Key
  private dialogueEscapeKey!: Phaser.Input.Keyboard.Key
  private dialogueUpKey!: Phaser.Input.Keyboard.Key
  private dialogueDownKey!: Phaser.Input.Keyboard.Key
  private dialogueEnterKey!: Phaser.Input.Keyboard.Key
  private selectedChoiceIndex = 0
  private currentChoices: DialogueChoice[] = []

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.gameState = GameStateManager.getInstance(this.game)
    this.inventory = InventoryManager.getInstance(this.game)
    this.questManager = QuestManager.getInstance(this.game)
    this.saveManager = SaveManager.getInstance(this.game)
    this.locationManager = LocationManager.getInstance(this.game)
    this.aiManager = AIDialogueManager.getInstance()

    this.createHUDBackground()
    this.createStatusBar()
    this.createMinimap()
    this.createQuestPanel()
    this.createDialogueBox()
    this.createInventoryBox()
    this.setupEventListeners()
    this.setupInput()
  }

  private setupInput() {
    this.inventoryKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I)
    this.inventoryKey.on('down', this.toggleInventory, this)
    
    this.saveKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F5)
    this.saveKey.on('down', this.saveGame, this)
  }

  private saveGame() {
    const success = this.saveManager.save()
    if (success) {
      this.showSaveMessage('Игра сохранена')
    } else {
      this.showSaveMessage('Ошибка сохранения')
    }
  }

  private showSaveMessage(text: string) {
    const msg = this.add.text(GAME_WIDTH / 2, this.HUD_Y - 30, text, {
      fontSize: '15px',
      color: '#00b894',
      backgroundColor: '#0a0a18cc',
      padding: { x: 12, y: 6 },
    })
    msg.setDepth(300)
    msg.setOrigin(0.5)
    
    this.time.delayedCall(2000, () => {
      msg.destroy()
    })
  }

  private createHUDBackground() {
    const bg = this.add.graphics()
    bg.fillStyle(0x0a0a18, 0.96)
    bg.fillRect(0, this.HUD_Y, GAME_WIDTH, this.HUD_H)
    bg.lineStyle(1, 0x4a4a6a, 0.8)
    bg.lineBetween(0, this.HUD_Y, GAME_WIDTH, this.HUD_Y)

    const divider1X = this.SECTION_W + 10
    const divider2X = GAME_WIDTH - this.SECTION_W - 10
    bg.lineStyle(1, 0x3a3a5a, 0.6)
    bg.lineBetween(divider1X, this.HUD_Y + 8, divider1X, GAME_HEIGHT - 8)
    bg.lineBetween(divider2X, this.HUD_Y + 8, divider2X, GAME_HEIGHT - 8)

    bg.setDepth(50)
  }

  private createStatusBar() {
    const x = 10
    const y = this.HUD_Y + 6

    const careerLevel = this.gameState.getCareerLevel()
    const levelData = CAREER_LEVELS.find((l) => l.id === careerLevel)

    const badge = this.add.graphics()
    badge.fillStyle(COLORS.primary, 0.3)
    badge.fillRoundedRect(x, y, this.SECTION_W - 5, 22, 4)
    badge.lineStyle(1, COLORS.primary, 0.6)
    badge.strokeRoundedRect(x, y, this.SECTION_W - 5, 22, 4)
    badge.setDepth(51)

    this.statusText = this.add.text(x + 10, y + 4, `⭐  ${levelData?.title || 'Junior Developer'}`, {
      fontSize: '13px',
      color: '#a29bfe',
      fontStyle: 'bold',
    })
    this.statusText.setDepth(52)

    const stressLabel = this.add.text(x + 6, y + 30, 'СТРЕСС', {
      fontSize: '10px',
      color: '#fdcb6e',
      fontStyle: 'bold',
    })
    stressLabel.setDepth(52)

    this.stressBar = this.add.graphics()
    this.stressBar.setDepth(52)
    this.drawBar(this.stressBar, x + 68, y + 30, this.SECTION_W - 80, 14, 0, COLORS.danger)

    this.stressWarning = this.add.text(x + this.SECTION_W - 8, y + 30, '', {
      fontSize: '14px',
    })
    this.stressWarning.setOrigin(1, 0)
    this.stressWarning.setDepth(52)

    const respectLabel = this.add.text(x + 6, y + 52, 'УВАЖЕНИЕ', {
      fontSize: '10px',
      color: '#00b894',
      fontStyle: 'bold',
    })
    respectLabel.setDepth(52)

    this.respectBar = this.add.graphics()
    this.respectBar.setDepth(52)
    this.drawBar(this.respectBar, x + 68, y + 52, this.SECTION_W - 80, 14, 0, COLORS.success)

    const inventoryHint = this.add.text(x + 6, y + 74, '[I] Инвентарь   [F5] Сохранить', {
      fontSize: '10px',
      color: '#555577',
    })
    inventoryHint.setDepth(52)

    this.updateBars()
  }

  private readonly MINIMAP_LOCATIONS = [
    { id: 'open-space', label: 'Опен Спейс', icon: '🏢', col: 0, row: 0 },
    { id: 'kitchen', label: 'Кухня', icon: '☕', col: 1, row: 0 },
    { id: 'meeting-room', label: 'Переговорка', icon: '🤝', col: 0, row: 1 },
    { id: 'director-office', label: 'Директор', icon: '👔', col: 1, row: 1 },
  ]

  private createMinimap() {
    const centerX = GAME_WIDTH / 2
    const y = this.HUD_Y + 4

    const title = this.add.text(centerX, y + 2, '🏢  ОФИС', {
      fontSize: '11px',
      color: '#6c5ce7',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5, 0)
    title.setDepth(52)

    this.minimapGraphics = this.add.graphics()
    this.minimapGraphics.setDepth(51)

    const boxW = 115
    const boxH = 22
    const gapX = 12
    const gapY = 8
    const totalW = boxW * 2 + gapX
    const startX = centerX - totalW / 2
    const boxStartY = y + 20

    this.MINIMAP_LOCATIONS.forEach((loc) => {
      const bx = startX + loc.col * (boxW + gapX)
      const by = boxStartY + loc.row * (boxH + gapY)
      const label = this.add.text(bx + boxW / 2, by + boxH / 2, `${loc.icon} ${loc.label}`, {
        fontSize: '10px',
        color: '#666688',
      })
      label.setOrigin(0.5, 0.5)
      label.setDepth(53)
      this.minimapLabels.set(loc.id, label)
    })

    this.locationNameText = this.add.text(centerX, y + 74, '', {
      fontSize: '10px',
      color: '#a29bfe',
    })
    this.locationNameText.setOrigin(0.5, 0)
    this.locationNameText.setDepth(52)

    this.drawMinimap()
  }

  private drawMinimap() {
    this.minimapGraphics.clear()

    const centerX = GAME_WIDTH / 2
    const y = this.HUD_Y + 24
    const currentLocation = this.locationManager.getCurrentLocation()

    const boxW = 115
    const boxH = 22
    const gapX = 12
    const gapY = 8
    const totalW = boxW * 2 + gapX
    const startX = centerX - totalW / 2

    this.MINIMAP_LOCATIONS.forEach((loc) => {
      const bx = startX + loc.col * (boxW + gapX)
      const by = y + loc.row * (boxH + gapY)
      const isActive = loc.id === currentLocation

      if (isActive) {
        this.minimapGraphics.fillStyle(COLORS.primary, 0.85)
        this.minimapGraphics.fillRoundedRect(bx, by, boxW, boxH, 4)
        this.minimapGraphics.lineStyle(1, 0xa29bfe, 1)
        this.minimapGraphics.strokeRoundedRect(bx, by, boxW, boxH, 4)
      } else {
        this.minimapGraphics.fillStyle(0x1e1e32, 0.9)
        this.minimapGraphics.fillRoundedRect(bx, by, boxW, boxH, 4)
        this.minimapGraphics.lineStyle(1, 0x3a3a5a, 0.5)
        this.minimapGraphics.strokeRoundedRect(bx, by, boxW, boxH, 4)
      }

      const label = this.minimapLabels.get(loc.id)
      if (label) {
        label.setColor(isActive ? '#ffffff' : '#555577')
      }
    })

    const currentLoc = this.MINIMAP_LOCATIONS.find((l) => l.id === currentLocation)
    if (currentLoc && this.locationNameText) {
      this.locationNameText.setText(`📍 ${currentLoc.label}`)
    }
  }

  private drawBar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    value: number,
    color: number
  ) {
    graphics.clear()

    graphics.fillStyle(0x2d2d44)
    graphics.fillRoundedRect(x, y, width, height, 4)

    const fillWidth = (width * Math.min(100, Math.max(0, value))) / 100
    if (fillWidth > 0) {
      graphics.fillStyle(color)
      graphics.fillRoundedRect(x, y, fillWidth, height, 4)
    }
  }

  private updateBars() {
    const stress = this.gameState.getStress()
    const respect = this.gameState.getRespect()
    const x = 10
    const y = this.HUD_Y + 6
    const barW = this.SECTION_W - 80

    const stressColor = stress > 70 ? COLORS.danger : stress > 40 ? COLORS.warning : COLORS.success
    this.drawBar(this.stressBar, x + 68, y + 30, barW, 14, stress, stressColor)
    this.drawBar(this.respectBar, x + 68, y + 52, barW, 14, respect, COLORS.success)

    if (stress > 70) {
      this.stressWarning.setText('⚠️')
    } else if (stress > 50) {
      this.stressWarning.setText('😰')
    } else {
      this.stressWarning.setText('')
    }

    const careerLevel = this.gameState.getCareerLevel()
    const levelData = CAREER_LEVELS.find((l) => l.id === careerLevel)
    this.statusText.setText(`⭐  ${levelData?.title || 'Junior Developer'}`)
  }

  private createQuestPanel() {
    const x = GAME_WIDTH - this.SECTION_W - 5
    const y = this.HUD_Y + 4

    this.questPanel = this.add.container(x, y)
    this.questPanel.setDepth(51)
    this.questPanel.setName('questPanel')

    const title = this.add.text(10, 4, '📋  КВЕСТЫ', {
      fontSize: '11px',
      color: '#6c5ce7',
      fontStyle: 'bold',
    })

    this.questPanel.add([title])
    this.updateQuestPanel()
  }

  private updateQuestPanel() {
    const existingItems = this.questPanel.getAll().filter((item) => item.name && item.name.startsWith('quest-item'))
    existingItems.forEach((item) => item.destroy())

    const quests = this.questManager.getActiveQuests()

    quests.slice(0, 3).forEach((quest, index) => {
      const questText = this.add.text(10, 22 + index * 22, `▸ ${quest.title}`, {
        fontSize: '11px',
        color: '#a29bfe',
        wordWrap: { width: this.SECTION_W - 20 },
      })
      questText.setName(`quest-item-${quest.id}`)
      this.questPanel.add(questText)
    })

    if (quests.length === 0) {
      const emptyText = this.add.text(10, 24, 'Нет активных квестов', {
        fontSize: '11px',
        color: '#3a3a5a',
      })
      emptyText.setName('quest-item-empty')
      this.questPanel.add(emptyText)
    }
  }

  private createInventoryBox() {
    const boxWidth = 400
    const boxHeight = 350
    const x = 1280 - boxWidth / 2 - 20
    const y = 720 / 2

    this.inventoryBox = this.add.container(x, y)

    const background = this.add.graphics()
    background.fillStyle(0x1a1a2e, 0.95)
    background.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 10)
    background.lineStyle(2, 0x6c5ce7)
    background.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 10)

    const title = this.add.text(-boxWidth / 2 + 15, -boxHeight / 2 + 15, 'Инвентарь', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#6c5ce7',
    })

    const closeHint = this.add.text(boxWidth / 2 - 100, -boxHeight / 2 + 17, '[I] Закрыть', {
      fontSize: '12px',
      color: '#a29bfe',
    })

    this.inventoryBox.add([background, title, closeHint])
    this.inventoryBox.setVisible(false)
    this.inventoryBox.setDepth(100)
  }

  private toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen
    this.inventoryBox.setVisible(this.inventoryOpen)

    if (this.inventoryOpen) {
      this.renderInventoryItems()
      this.scene.pause('GameScene')
    } else {
      this.clearInventoryItems()
      this.scene.resume('GameScene')
    }
  }

  private renderInventoryItems() {
    this.clearInventoryItems()

    const items = this.inventory.getAllItems()
    const startX = -170
    const startY = -120
    const slotSize = 64
    const padding = 10
    const cols = 4

    items.forEach((item, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = startX + col * (slotSize + padding)
      const y = startY + row * (slotSize + padding)

      this.createItemSlot(item, x, y)
    })

    if (items.length === 0) {
      const emptyText = this.add.text(0, 0, 'Инвентарь пуст', {
        fontSize: '16px',
        color: '#666666',
      })
      emptyText.setOrigin(0.5)
      emptyText.setName('inventory-empty')
      this.inventoryBox.add(emptyText)
    }
  }

  private createItemSlot(item: ItemData, x: number, y: number) {
    const slot = this.add.container(x, y)
    slot.setName(`slot-${item.id}`)

    const bg = this.add.graphics()
    bg.fillStyle(0x2d2d44)
    bg.fillRoundedRect(0, 0, 64, 64, 6)
    bg.lineStyle(1, 0x4a4a6a)
    bg.strokeRoundedRect(0, 0, 64, 64, 6)

    const itemColor = item.type === 'consumable' ? 0x00b894 : item.type === 'quest' ? 0xfdcb6e : 0x6c5ce7
    const itemIcon = this.add.graphics()
    itemIcon.fillStyle(itemColor)
    itemIcon.fillRect(10, 10, 44, 44)

    const nameLabel = this.add.text(32, 75, item.name, {
      fontSize: '10px',
      color: '#ffffff',
    })
    nameLabel.setOrigin(0.5)

    slot.add([bg, itemIcon, nameLabel])

    if (item.usable) {
      slot.setInteractive({ useHandCursor: true })
      
      slot.on('pointerover', () => {
        bg.clear()
        bg.fillStyle(0x3d3d5c)
        bg.fillRoundedRect(0, 0, 64, 64, 6)
        bg.lineStyle(2, 0x6c5ce7)
        bg.strokeRoundedRect(0, 0, 64, 64, 6)
      })

      slot.on('pointerout', () => {
        bg.clear()
        bg.fillStyle(0x2d2d44)
        bg.fillRoundedRect(0, 0, 64, 64, 6)
        bg.lineStyle(1, 0x4a4a6a)
        bg.strokeRoundedRect(0, 0, 64, 64, 6)
      })

      slot.on('pointerdown', () => {
        this.useItem(item)
      })
    }

    this.inventoryBox.add(slot)
  }

  private useItem(item: ItemData) {
    const usedItem = this.inventory.useItem(item.id)
    if (!usedItem) return

    if (usedItem.effects) {
      if (usedItem.effects.stress) {
        this.gameState.addStress(usedItem.effects.stress)
      }
      if (usedItem.effects.respect) {
        this.gameState.addRespect(usedItem.effects.respect)
      }
    }

    this.renderInventoryItems()
  }

  private clearInventoryItems() {
    const items = this.inventoryBox.getAll()
    items.forEach((item) => {
      if (item.name && (item.name.startsWith('slot-') || item.name === 'inventory-empty')) {
        item.destroy()
      }
    })
  }

  private setupEventListeners() {
    this.game.events.on('startDialogue', this.startDialogue, this)
    this.game.events.on('stressChanged', this.onStressChanged, this)
    this.game.events.on('respectChanged', this.onRespectChanged, this)
    this.game.events.on('careerLevelUp', this.onCareerLevelUp, this)
    this.game.events.on('gameOver', this.onGameOver, this)
    this.game.events.on('itemAdded', this.onItemAdded, this)
    this.game.events.on('questStarted', this.onQuestStarted, this)
    this.game.events.on('questCompleted', this.onQuestCompleted, this)
    this.game.events.on('locationChanged', this.onLocationChanged, this)
  }

  private onQuestStarted() {
    this.updateQuestPanel()
  }

  private onQuestCompleted() {
    this.updateQuestPanel()
  }

  private onLocationChanged() {
    this.drawMinimap()
  }

  private onItemAdded() {
    if (this.inventoryOpen) {
      this.renderInventoryItems()
    }
    this.checkQuestProgress()
  }

  private checkQuestProgress() {
    const quests = this.questManager.getActiveQuests()
    for (const quest of quests) {
      if (quest.requiredItems) {
        const hasAllItems = quest.requiredItems.every((itemId) => this.inventory.hasItem(itemId))
        if (hasAllItems) {
          this.questManager.updateProgress(quest.id, 100)
        }
      }
    }
  }

  private onStressChanged() {
    this.updateBars()
  }

  private onRespectChanged() {
    this.updateBars()
  }

  private onCareerLevelUp() {
    this.updateBars()
  }

  private onGameOver(data: { reason: string }) {
    this.scene.pause('GameScene')
    
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.8)
    overlay.fillRect(0, 0, 1280, 720)

    const reasonText = data.reason === 'burnout' 
      ? 'Вы выгорели и уволились...' 
      : 'Game Over'

    this.add.text(640, 340, reasonText, {
      fontSize: '32px',
      color: '#e17055',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(640, 400, 'Нажмите R для перезапуска', {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5)

    this.input.keyboard!.once('keydown-R', () => {
      this.gameState.reset()
      this.inventory.clear()
      this.questManager.clear()
      this.scene.restart()
      this.scene.start('GameScene')
    })
  }

  private createDialogueBox() {
    const boxWidth = 820
    const boxHeight = 240
    const x = GAME_WIDTH / 2
    const y = this.HUD_Y - boxHeight / 2 - 10

    this.dialogueBox = this.add.container(x, y)

    const background = this.add.graphics()
    background.fillStyle(0x1a1a2e, 0.97)
    background.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 12)
    background.lineStyle(2, 0x6c5ce7)
    background.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 12)

    const topLine = this.add.graphics()
    topLine.lineStyle(1, 0x4a4a6a, 0.5)
    topLine.lineBetween(-boxWidth / 2 + 12, -boxHeight / 2 + 40, boxWidth / 2 - 12, -boxHeight / 2 + 40)

    this.speakerText = this.add.text(-boxWidth / 2 + 20, -boxHeight / 2 + 12, '', {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#a29bfe',
    })

    this.dialogueText = this.add.text(-boxWidth / 2 + 20, -boxHeight / 2 + 52, '', {
      fontSize: '15px',
      color: '#e0e0f0',
      wordWrap: { width: boxWidth - 48 },
    })

    this.choicesContainer = this.add.container(-boxWidth / 2 + 20, -boxHeight / 2 + 140)

    const inputHtml = `
      <input type="text" id="ai-input" placeholder="Введите сообщение..." 
        style="width: 720px; padding: 10px; background: #0d0d1a; border: 1px solid #6c5ce7; 
        border-radius: 5px; color: white; font-size: 14px; outline: none;">
    `
    this.inputField = this.add.dom(0, 70).createFromHTML(inputHtml)
    this.inputField.setVisible(false)

    this.dialogueHint = this.add.text(boxWidth / 2 - 16, boxHeight / 2 - 10, '[ПРОБЕЛ] Далее  [ESC] Закрыть', {
      fontSize: '11px',
      color: '#444466',
    })
    this.dialogueHint.setOrigin(1, 1)

    this.dialogueBox.add([background, topLine, this.speakerText, this.dialogueText, this.choicesContainer, this.inputField, this.dialogueHint])
    this.dialogueBox.setVisible(false)
    this.dialogueBox.setDepth(200)

    this.dialogueAdvanceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.dialogueEscapeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    this.dialogueUpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    this.dialogueDownKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    this.dialogueEnterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  }

  private startDialogue(data: Dialogue | { npcId: string; name: string; isAI: true }) {
    if ('isAI' in data && data.isAI) {
      this.isAIMode = true
      this.aiDialogueData = { npcId: data.npcId, name: data.name }
      this.currentDialogue = null
      this.aiConversationHistory = []
      this.speakerText.setText(data.name)
      this.dialogueText.setText('Привет! Чем могу помочь?')
      this.choicesContainer.removeAll(true)
      this.inputField.setVisible(true)
      this.dialogueHint.setText('[ESC] Закрыть')
      this.dialogueBox.setVisible(true)
      this.setupAIInput()
    } else {
      this.isAIMode = false
      this.aiDialogueData = null
      this.currentDialogue = data as Dialogue
      this.currentLineIndex = 0
      this.inputField.setVisible(false)
      this.dialogueHint.setText('[ПРОБЕЛ] Далее  [ESC] Закрыть')
      this.dialogueBox.setVisible(true)
      this.showCurrentLine()
    }

    this.dialogueAdvanceKey.on('down', this.onDialogueAdvance, this)
    this.dialogueEscapeKey.on('down', this.endDialogue, this)
  }

  private onDialogueAdvance() {
    if (this.isAIMode) return
    if (this.currentChoices.length === 0) {
      this.nextLine()
    }
  }

  private showCurrentLine() {
    if (!this.currentDialogue || this.isAIMode) return

    const line = this.currentDialogue.lines[this.currentLineIndex]
    if (!line) {
      this.endDialogue()
      return
    }

    this.speakerText.setText(line.speaker)
    this.dialogueText.setText(line.text)
    this.choicesContainer.removeAll(true)

    if (line.choices && line.choices.length > 0) {
      this.showChoices(line.choices)
      this.dialogueHint.setText('[ESC] Закрыть')
    } else {
      this.dialogueHint.setText('[ПРОБЕЛ] Далее  [ESC] Закрыть')
    }
  }

  private showChoices(choices: DialogueChoice[]) {
    const validChoices = choices.filter((choice) => this.checkChoiceCondition(choice))
    this.currentChoices = validChoices
    this.selectedChoiceIndex = 0
    this.renderChoices()

    this.dialogueUpKey.on('down', this.onChoiceUp, this)
    this.dialogueDownKey.on('down', this.onChoiceDown, this)
    this.dialogueEnterKey.on('down', this.onChoiceConfirm, this)
  }

  private renderChoices() {
    this.choicesContainer.removeAll(true)

    this.currentChoices.forEach((choice, index) => {
      const isSelected = index === this.selectedChoiceIndex
      const rowBg = this.add.graphics()

      if (isSelected) {
        rowBg.fillStyle(0x6c5ce7, 0.25)
        rowBg.fillRoundedRect(-4, index * 34 - 2, 760, 28, 4)
        rowBg.lineStyle(1, 0x6c5ce7, 0.5)
        rowBg.strokeRoundedRect(-4, index * 34 - 2, 760, 28, 4)
      }

      const choiceText = this.add.text(16, index * 34 + 6, `${isSelected ? '▶' : '▸'}  ${choice.text}`, {
        fontSize: '14px',
        color: isSelected ? '#ffffff' : '#8888bb',
      })

      choiceText.setInteractive({ useHandCursor: true })

      choiceText.on('pointerover', () => {
        this.selectedChoiceIndex = index
        this.renderChoices()
      })

      choiceText.on('pointerdown', () => {
        this.confirmChoiceSelection()
      })

      this.choicesContainer.add([rowBg, choiceText])
    })
  }

  private onChoiceUp() {
    if (this.currentChoices.length === 0) return
    this.selectedChoiceIndex = (this.selectedChoiceIndex - 1 + this.currentChoices.length) % this.currentChoices.length
    this.renderChoices()
  }

  private onChoiceDown() {
    if (this.currentChoices.length === 0) return
    this.selectedChoiceIndex = (this.selectedChoiceIndex + 1) % this.currentChoices.length
    this.renderChoices()
  }

  private onChoiceConfirm() {
    if (this.currentChoices.length === 0) return
    this.confirmChoiceSelection()
  }

  private confirmChoiceSelection() {
    const choice = this.currentChoices[this.selectedChoiceIndex]
    if (!choice) return
    this.currentChoices = []
    this.dialogueUpKey.off('down', this.onChoiceUp, this)
    this.dialogueDownKey.off('down', this.onChoiceDown, this)
    this.dialogueEnterKey.off('down', this.onChoiceConfirm, this)
    this.handleChoice(choice)
  }

  private checkChoiceCondition(choice: DialogueChoice): boolean {
    if (!choice.condition) return true

    if (choice.condition.hasItem) {
      if (!this.inventory.hasItem(choice.condition.hasItem)) {
        return false
      }
    }

    if (choice.condition.hasQuest) {
      if (!this.questManager.hasQuest(choice.condition.hasQuest)) {
        return false
      }
    }

    if (choice.condition.questCompleted) {
      if (!this.questManager.isQuestCompleted(choice.condition.questCompleted)) {
        return false
      }
    }

    if (choice.condition.hasRespect !== undefined) {
      if (this.gameState.getRespect() < choice.condition.hasRespect) {
        return false
      }
    }

    return true
  }

  private handleChoice(choice: DialogueChoice) {
    if (choice.stressChange) {
      this.gameState.addStress(choice.stressChange)
    }
    if (choice.respectChange) {
      this.gameState.addRespect(choice.respectChange)
    }

    if (choice.startQuest) {
      this.questManager.startQuest({
        id: 'find-documentation',
        title: 'Найти документацию',
        description: 'Найдите документацию по проекту на кухне',
        type: 'main',
        completed: false,
        progress: 0,
        requiredItems: ['documentation'],
        rewards: { respect: 20, stress: -10 },
      })
    }

    if (choice.completeQuest) {
      this.questManager.completeQuest(choice.completeQuest)
    }

    if (choice.takeItem) {
      this.inventory.removeItem(choice.takeItem)
    }

    if (choice.nextDialogue && this.currentDialogue) {
      this.currentDialogue = this.findDialogue(choice.nextDialogue)
      this.currentLineIndex = 0
      this.showCurrentLine()
    } else {
      this.nextLine()
    }
  }

  private nextLine() {
    this.currentLineIndex++
    this.showCurrentLine()
  }

  private findDialogue(_id: string): Dialogue | null {
    return null
  }

  private endDialogue() {
    this.dialogueAdvanceKey.off('down', this.onDialogueAdvance, this)
    this.dialogueEscapeKey.off('down', this.endDialogue, this)
    this.dialogueUpKey.off('down', this.onChoiceUp, this)
    this.dialogueDownKey.off('down', this.onChoiceDown, this)
    this.dialogueEnterKey.off('down', this.onChoiceConfirm, this)

    this.currentChoices = []
    this.dialogueBox.setVisible(false)
    this.currentDialogue = null
    this.aiDialogueData = null
    this.isAIMode = false
    this.aiConversationHistory = []
    this.inputField.setVisible(false)
    this.scene.get('GameScene').scene.resume()
  }

  private setupAIInput() {
    const input = document.getElementById('ai-input') as HTMLInputElement
    if (!input) return

    input.value = ''
    input.focus()

    input.onkeydown = async (e) => {
      if (e.key === 'Enter' && !this.isAITyping) {
        const message = input.value.trim()
        if (message) {
          input.value = ''
          await this.sendAIMessage(message)
        }
      }
    }
  }

  private async sendAIMessage(message: string) {
    if (this.isAITyping || !this.aiDialogueData) return
    
    this.isAITyping = true
    this.dialogueText.setText('...')
    
    this.aiConversationHistory.push({ role: 'user', content: message })

    const npcState = this.gameState.getNPCState(this.aiDialogueData.npcId)

    const context: AIContext = {
      playerName: 'Игрок',
      careerLevel: this.gameState.getCareerLevel(),
      stress: this.gameState.getStress(),
      respect: this.gameState.getRespect(),
      npcId: this.aiDialogueData.npcId,
      relationship: npcState?.relationship || 0,
      conversationHistory: this.aiConversationHistory,
      previousTopics: npcState?.seenDialogues || []
    }

    try {
      const response = await this.aiManager.generateResponse(message, context)
      
      this.dialogueText.setText(response.text)
      this.aiConversationHistory.push({ role: 'assistant', content: response.text })

      if (response.stressChange) {
        this.gameState.addStress(response.stressChange)
      }
      if (response.respectChange) {
        this.gameState.addRespect(response.respectChange)
      }
    } catch (error) {
      console.error('AI error:', error)
      this.dialogueText.setText('Извини, не расслышал. Можешь повторить?')
    }

    this.isAITyping = false
    this.setupAIInput()
  }
}
