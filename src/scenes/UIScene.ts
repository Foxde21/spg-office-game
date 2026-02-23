import Phaser from 'phaser'
import type { Dialogue, DialogueChoice, ItemData } from '../types'
import { GameStateManager } from '../managers/GameState'
import { InventoryManager } from '../managers/Inventory'
import { QuestManager } from '../managers/Quest'
import { LocationManager } from '../managers/LocationManager'
import { CAREER_LEVELS, COLORS } from '../config'
import type { LocationId } from '../types/Location'

export class UIScene extends Phaser.Scene {
  private dialogueBox!: Phaser.GameObjects.Container
  private dialogueText!: Phaser.GameObjects.Text
  private speakerText!: Phaser.GameObjects.Text
  private choicesContainer!: Phaser.GameObjects.Container
  private currentDialogue: Dialogue | null = null
  private currentLineIndex = 0
  private gameState!: GameStateManager
  private inventory!: InventoryManager
  private questManager!: QuestManager

  private stressBar!: Phaser.GameObjects.Graphics
  private respectBar!: Phaser.GameObjects.Graphics
  private statusText!: Phaser.GameObjects.Text

  private inventoryBox!: Phaser.GameObjects.Container
  private inventoryOpen = false
  private inventoryKey!: Phaser.Input.Keyboard.Key

  private questPanel!: Phaser.GameObjects.Container
  private minimap!: Phaser.GameObjects.Container
  private minimapLocationText!: Phaser.GameObjects.Text
  private locationManager!: LocationManager
  private questKey!: Phaser.Input.Keyboard.Key
  private questPanelOpen = false

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.gameState = GameStateManager.getInstance(this.game)
    this.inventory = InventoryManager.getInstance(this.game)
    this.questManager = QuestManager.getInstance(this.game)
    this.locationManager = LocationManager.getInstance(this.game)
    
    this.createStatusBar()
    this.createDialogueBox()
    this.createInventoryBox()
    this.createQuestPanel()
    this.createMinimap()
    this.setupEventListeners()
    this.setupInput()
  }

  private setupInput() {
    this.inventoryKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I)
    this.inventoryKey.on('down', this.toggleInventory, this)
    this.questKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    this.questKey.on('down', this.toggleQuestPanel, this)
  }

  private createStatusBar() {
    const boxWidth = 360
    const boxHeight = 70
    const x = 1280 / 2 - boxWidth / 2
    const y = 720 - boxHeight - 10

    const container = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x1a1a2e, 0.85)
    bg.fillRoundedRect(0, 0, boxWidth, boxHeight, 8)
    bg.lineStyle(1, 0x4a4a6a)
    bg.strokeRoundedRect(0, 0, boxWidth, boxHeight, 8)

    const careerLevel = this.gameState.getCareerLevel()
    const levelData = CAREER_LEVELS.find((l) => l.id === careerLevel)
    
    this.statusText = this.add.text(boxWidth / 2, 10, `${levelData?.title || 'Junior'}`, {
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ffffff',
    })
    this.statusText.setOrigin(0.5, 0)

    this.stressBar = this.add.graphics()
    this.drawBar(this.stressBar, 20, 32, 150, 14, 0, COLORS.danger)

    const stressLabel = this.add.text(180, 30, 'Стресс', {
      fontSize: '12px',
      color: '#a29bfe',
    })

    this.respectBar = this.add.graphics()
    this.drawBar(this.respectBar, 20, 50, 150, 14, 0, COLORS.success)

    const respectLabel = this.add.text(180, 48, 'Уважение', {
      fontSize: '12px',
      color: '#a29bfe',
    })

    const divider = this.add.graphics()
    divider.lineStyle(1, 0x4a4a6a)
    divider.lineBetween(boxWidth - 100, 15, boxWidth - 100, boxHeight - 15)

    const hints = this.add.text(boxWidth - 85, 18, '[I] Инвентарь\n[Q] Квесты', {
      fontSize: '11px',
      color: '#a29bfe',
      lineSpacing: 6,
    })

    container.add([bg, divider, this.statusText, stressLabel, this.stressBar, respectLabel, this.respectBar, hints])

    this.updateBars()
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

    const stressColor = stress > 70 ? COLORS.danger : stress > 40 ? COLORS.warning : COLORS.success
    this.drawBar(this.stressBar, 20, 32, 150, 14, stress, stressColor)
    this.drawBar(this.respectBar, 20, 50, 150, 14, respect, COLORS.success)

    const careerLevel = this.gameState.getCareerLevel()
    const levelData = CAREER_LEVELS.find((l) => l.id === careerLevel)
    this.statusText.setText(`${levelData?.title || 'Junior'}`)
  }

  private createQuestPanel() {
    const boxWidth = 280
    const boxHeight = 200
    const x = 1280 / 2
    const y = 720 / 2

    this.questPanel = this.add.container(x, y)

    const background = this.add.graphics()
    background.fillStyle(0x1a1a2e, 0.95)
    background.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 10)
    background.lineStyle(2, 0x6c5ce7)
    background.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 10)

    const title = this.add.text(-boxWidth / 2 + 15, -boxHeight / 2 + 10, '📋 Активные квесты', {
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#6c5ce7',
    })

    const closeHint = this.add.text(boxWidth / 2 - 80, -boxHeight / 2 + 12, '[Q] Закрыть', {
      fontSize: '12px',
      color: '#a29bfe',
    })

    this.questPanel.add([background, title, closeHint])
    this.questPanel.setName('questPanel')
    this.questPanel.setVisible(false)
    this.questPanel.setDepth(150)
  }

  private toggleQuestPanel() {
    this.questPanelOpen = !this.questPanelOpen
    this.questPanel.setVisible(this.questPanelOpen)

    if (this.questPanelOpen) {
      this.updateQuestPanel()
    }
  }

  private updateQuestPanel() {
    const existingItems = this.questPanel.getAll().filter((item) => item.name && item.name.startsWith('quest-item'))
    existingItems.forEach((item) => item.destroy())

    const quests = this.questManager.getActiveQuests()
    const startY = -70

    quests.slice(0, 4).forEach((quest, index) => {
      const questText = this.add.text(-100, startY + index * 35, `• ${quest.title}`, {
        fontSize: '12px',
        color: '#ffffff',
        wordWrap: { width: 200 },
      })
      questText.setName(`quest-item-${quest.id}`)
      this.questPanel.add(questText)
    })

    if (quests.length === 0) {
      const emptyText = this.add.text(0, 0, 'Нет активных квестов', {
        fontSize: '12px',
        color: '#666666',
      })
      emptyText.setOrigin(0.5)
      emptyText.setName('quest-item-empty')
      this.questPanel.add(emptyText)
    }
  }

  private createMinimap() {
    const minimapWidth = 200
    const minimapHeight = 100
    const x = 10 + minimapWidth / 2
    const y = 720 - minimapHeight / 2 - 10

    this.minimap = this.add.container(x, y)

    const background = this.add.graphics()
    background.fillStyle(0x1a1a2e, 0.7)
    background.fillRoundedRect(-minimapWidth / 2, -minimapHeight / 2, minimapWidth, minimapHeight, 6)
    background.lineStyle(1, 0x4a4a6a)
    background.strokeRoundedRect(-minimapWidth / 2, -minimapHeight / 2, minimapWidth, minimapHeight, 6)

    const currentLocation = this.locationManager.getCurrentLocationData()
    this.minimapLocationText = this.add.text(0, -35, currentLocation.name, {
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#a29bfe',
    })
    this.minimapLocationText.setOrigin(0.5)

    this.drawMinimapLocations()

    this.minimap.add([background, this.minimapLocationText])
    this.minimap.setName('minimap')
  }

  private drawMinimapLocations() {
    const existingLocations = this.minimap.getAll().filter((item) => item.name && item.name.startsWith('minimap-loc'))
    existingLocations.forEach((item) => item.destroy())

    const locations: LocationId[] = ['open-space', 'kitchen', 'meeting-room', 'director-office']
    const currentLocationId = this.locationManager.getCurrentLocation()
    const visitedLocations = this.locationManager.getVisitedLocations()

    const positions: Record<LocationId, { x: number; y: number }> = {
      'open-space': { x: -50, y: 20 },
      'kitchen': { x: 50, y: 20 },
      'meeting-room': { x: -50, y: -15 },
      'director-office': { x: 50, y: -15 },
    }

    locations.forEach((locId) => {
      const pos = positions[locId]
      const isVisited = visitedLocations.includes(locId)
      const isCurrent = locId === currentLocationId

      const locGraphics = this.add.graphics()
      const size = 18

      if (isCurrent) {
        locGraphics.fillStyle(0x6c5ce7)
      } else if (isVisited) {
        locGraphics.fillStyle(0x4a4a6a)
      } else {
        locGraphics.fillStyle(0x2d2d44)
      }
      locGraphics.fillRoundedRect(pos.x - size / 2, pos.y - size / 2, size, size, 4)

      if (isCurrent) {
        locGraphics.lineStyle(2, 0xa29bfe)
        locGraphics.strokeRoundedRect(pos.x - size / 2 - 2, pos.y - size / 2 - 2, size + 4, size + 4, 4)
      }

      const label = this.add.text(pos.x, pos.y, locId === 'open-space' ? 'OS' : locId === 'kitchen' ? 'K' : locId === 'meeting-room' ? 'П' : 'Д', {
        fontSize: '9px',
        color: isCurrent ? '#ffffff' : '#a29bfe',
      })
      label.setOrigin(0.5)
      label.setName(`minimap-loc-${locId}`)

      this.minimap.add([locGraphics, label])
    })
  }

  private updateMinimap() {
    const currentLocation = this.locationManager.getCurrentLocationData()
    this.minimapLocationText.setText(currentLocation.name)
    this.drawMinimapLocations()
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
    this.updateMinimap()
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
      this.locationManager.reset()
      this.scene.restart()
      this.scene.start('GameScene')
    })
  }

  private createDialogueBox() {
    const boxWidth = 800
    const boxHeight = 200
    const x = 1280 / 2
    const y = 720 - boxHeight / 2 - 20

    this.dialogueBox = this.add.container(x, y)

    const background = this.add.graphics()
    background.fillStyle(0x2d2d44, 0.95)
    background.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 10)
    background.lineStyle(2, 0x6c5ce7)
    background.strokeRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 10)

    this.speakerText = this.add.text(-boxWidth / 2 + 20, -boxHeight / 2 + 15, '', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#6c5ce7',
    })

    this.dialogueText = this.add.text(-boxWidth / 2 + 20, -boxHeight / 2 + 50, '', {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: boxWidth - 40 },
    })

    this.choicesContainer = this.add.container(0, 50)

    this.dialogueBox.add([background, this.speakerText, this.dialogueText, this.choicesContainer])
    this.dialogueBox.setVisible(false)
    this.dialogueBox.setDepth(200)
  }

  private startDialogue(dialogue: Dialogue) {
    this.currentDialogue = dialogue
    this.currentLineIndex = 0
    this.dialogueBox.setVisible(true)
    this.showCurrentLine()
  }

  private showCurrentLine() {
    if (!this.currentDialogue) return

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
    }
  }

  private showChoices(choices: DialogueChoice[]) {
    const validChoices = choices.filter((choice) => this.checkChoiceCondition(choice))

    validChoices.forEach((choice, index) => {
      const choiceText = this.add.text(-350, index * 35, `▸ ${choice.text}`, {
        fontSize: '14px',
        color: '#a29bfe',
        backgroundColor: '#1a1a2e',
        padding: { x: 10, y: 5 },
      })

      choiceText.setInteractive({ useHandCursor: true })

      choiceText.on('pointerover', () => {
        choiceText.setColor('#ffffff')
      })

      choiceText.on('pointerout', () => {
        choiceText.setColor('#a29bfe')
      })

      choiceText.on('pointerdown', () => {
        this.handleChoice(choice)
      })

      this.choicesContainer.add(choiceText)
    })
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
    this.dialogueBox.setVisible(false)
    this.currentDialogue = null
    this.scene.get('GameScene').scene.resume()
  }
}
