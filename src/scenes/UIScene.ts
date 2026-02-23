import Phaser from 'phaser'
import type { Dialogue, DialogueChoice } from '../types'
import { GameStateManager } from '../managers/GameState'
import { CAREER_LEVELS, COLORS } from '../config'

export class UIScene extends Phaser.Scene {
  private dialogueBox!: Phaser.GameObjects.Container
  private dialogueText!: Phaser.GameObjects.Text
  private speakerText!: Phaser.GameObjects.Text
  private choicesContainer!: Phaser.GameObjects.Container
  private currentDialogue: Dialogue | null = null
  private currentLineIndex = 0
  private gameState!: GameStateManager

  private stressBar!: Phaser.GameObjects.Graphics
  private respectBar!: Phaser.GameObjects.Graphics
  private statusText!: Phaser.GameObjects.Text
  private stressWarning!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.gameState = GameStateManager.getInstance(this.game)
    
    this.createStatusBar()
    this.createDialogueBox()
    this.setupEventListeners()
  }

  private createStatusBar() {
    const container = this.add.container(20, 20)

    const bg = this.add.graphics()
    bg.fillStyle(0x1a1a2e, 0.9)
    bg.fillRoundedRect(0, 0, 350, 80, 8)

    const careerLevel = this.gameState.getCareerLevel()
    const levelData = CAREER_LEVELS.find((l) => l.id === careerLevel)
    
    this.statusText = this.add.text(10, 10, `Уровень: ${levelData?.title || 'Junior'}`, {
      fontSize: '14px',
      color: '#ffffff',
    })

    const stressLabel = this.add.text(10, 32, 'Стресс:', {
      fontSize: '12px',
      color: '#ffffff',
    })

    this.stressBar = this.add.graphics()
    this.drawBar(this.stressBar, 80, 32, 200, 16, 0, COLORS.danger)

    const respectLabel = this.add.text(10, 54, 'Уважение:', {
      fontSize: '12px',
      color: '#ffffff',
    })

    this.respectBar = this.add.graphics()
    this.drawBar(this.respectBar, 80, 54, 200, 16, 0, COLORS.success)

    this.stressWarning = this.add.text(300, 40, '', {
      fontSize: '20px',
    })
    this.stressWarning.setOrigin(0.5)

    container.add([bg, this.statusText, stressLabel, this.stressBar, respectLabel, this.respectBar, this.stressWarning])

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
    this.drawBar(this.stressBar, 80, 32, 200, 16, stress, stressColor)
    this.drawBar(this.respectBar, 80, 54, 200, 16, respect, COLORS.success)

    if (stress > 70) {
      this.stressWarning.setText('⚠️')
    } else if (stress > 50) {
      this.stressWarning.setText('😰')
    } else {
      this.stressWarning.setText('')
    }

    const careerLevel = this.gameState.getCareerLevel()
    const levelData = CAREER_LEVELS.find((l) => l.id === careerLevel)
    this.statusText.setText(`Уровень: ${levelData?.title || 'Junior'}`)
  }

  private setupEventListeners() {
    this.game.events.on('startDialogue', this.startDialogue, this)
    this.game.events.on('stressChanged', this.onStressChanged, this)
    this.game.events.on('respectChanged', this.onRespectChanged, this)
    this.game.events.on('careerLevelUp', this.onCareerLevelUp, this)
    this.game.events.on('gameOver', this.onGameOver, this)
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
    choices.forEach((choice, index) => {
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

  private handleChoice(choice: DialogueChoice) {
    if (choice.stressChange) {
      this.gameState.addStress(choice.stressChange)
    }
    if (choice.respectChange) {
      this.gameState.addRespect(choice.respectChange)
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
