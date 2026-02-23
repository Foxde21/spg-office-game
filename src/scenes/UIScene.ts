import Phaser from 'phaser'
import { Dialogue } from '../types'

export class UIScene extends Phaser.Scene {
  private dialogueBox!: Phaser.GameObjects.Container
  private dialogueText!: Phaser.GameObjects.Text
  private speakerText!: Phaser.GameObjects.Text
  private choicesContainer!: Phaser.GameObjects.Container
  private currentDialogue: Dialogue | null = null
  private currentLineIndex = 0

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.createDialogueBox()
    this.createUI()

    this.game.events.on('startDialogue', this.startDialogue, this)
  }

  private createUI() {
    this.add.text(20, 20, 'Уровень: Junior | Стресс: 0% | Уважение: 0', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
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

  private showChoices(choices: Array<{ text: string; nextDialogue?: string }>) {
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

  private handleChoice(choice: { text: string; nextDialogue?: string }) {
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

  private findDialogue(id: string): Dialogue | null {
    return null
  }

  private endDialogue() {
    this.dialogueBox.setVisible(false)
    this.currentDialogue = null
    this.scene.get('GameScene').scene.resume()
  }
}
