import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON, TEXT_STYLE_SUB } from '../styles/textStyles'

export class MenuSceneV2 extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' }) // keep the same scene key to allow swapping via import if needed
  }

  preload() {}

  create() {
    const { width, height } = this.scale

    // Welcome header
    this.add.text(width / 2, height / 2 - 200, 'Welcome to Office Quest', TEXT_STYLE_TITLE).setOrigin(0.5)

    // Subtitle / description
    this.add.text(width / 2, height / 2 - 150, 'Path from Junior to Team Lead without burning out', TEXT_STYLE_SUB).setOrigin(0.5)

    // Buttons
    const newGame = this.add.text(width / 2, height / 2 - 20, 'Новая игра', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    newGame.on('pointerdown', () => {
      this.scene.start('PreloadScene', { runGame: true })
    })

    const continueBtn = this.add.text(width / 2, height / 2 + 40, 'Продолжить', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    continueBtn.on('pointerdown', () => {
      this.scene.start('GameScene')
    })

    const settings = this.add.text(width / 2, height / 2 + 100, 'Настройки', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    settings.on('pointerdown', () => {
      console.log('Settings clicked')
    })
  }
}
