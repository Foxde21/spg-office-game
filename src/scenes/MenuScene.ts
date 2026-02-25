import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON, TEXT_STYLE_SUB } from '../styles/textStyles'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  preload() {}

  private menuContent!: Phaser.GameObjects.Container

  create() {
    const { width, height } = this.scale
    const title = this.add.text(width / 2, height / 2 - 200, 'Office Quest', TEXT_STYLE_TITLE).setOrigin(0.5)
    const subtitle = this.add.text(width / 2, height / 2 - 140, 'Путь от Джуна до Тимлида без выгорания', TEXT_STYLE_SUB).setOrigin(0.5)
    const newGame = this.add.text(width / 2, height / 2 - 20, 'Новая игра', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    newGame.on('pointerover', () => newGame.setColor('#a29bfe'))
    newGame.on('pointerout', () => newGame.setColor('#ffffff'))
    newGame.on('pointerdown', () => {
      this.scene.start('PreloadScene', { runGame: true })
    })
    const continueBtn = this.add.text(width / 2, height / 2 + 40, 'Продолжить', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    continueBtn.on('pointerover', () => continueBtn.setColor('#a29bfe'))
    continueBtn.on('pointerout', () => continueBtn.setColor('#ffffff'))
    continueBtn.on('pointerdown', () => {
      this.scene.start('GameScene')
    })
    const settings = this.add.text(width / 2, height / 2 + 100, 'Настройки', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    settings.on('pointerover', () => settings.setColor('#a29bfe'))
    settings.on('pointerout', () => settings.setColor('#ffffff'))
    settings.on('pointerdown', () => {
      this.scene.launch('SettingsScene')
      this.scene.bringToTop('SettingsScene')
    })
    this.menuContent = this.add.container(0, 0, [title, subtitle, newGame, continueBtn, settings])
  }

  update() {
    if (this.menuContent) {
      const settingsActive = this.scene.manager.isActive('SettingsScene')
      this.menuContent.setAlpha(settingsActive ? 0.4 : 1)
    }
  }
}
