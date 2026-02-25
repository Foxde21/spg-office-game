import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON } from '../styles/textStyles'

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' })
  }

  create() {
    const { width, height } = this.scale
    const bg = this.add.graphics()
    bg.fillStyle(0x000000, 0.6)
    bg.fillRect(0, 0, width, height)

    this.add.text(width / 2, height / 2 - 120, 'Пауза', TEXT_STYLE_TITLE).setOrigin(0.5)

    const continueBtn = this.add.text(width / 2, height / 2 - 30, 'Продолжить', TEXT_STYLE_BUTTON)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    this.addButtonHover(continueBtn)
    continueBtn.on('pointerdown', () => {
      this.scene.resume('GameScene')
      this.scene.resume('UIScene')
      this.scene.stop('PauseScene')
    })

    const settingsBtn = this.add.text(width / 2, height / 2 + 30, 'Настройки', TEXT_STYLE_BUTTON)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    this.addButtonHover(settingsBtn)
    settingsBtn.on('pointerdown', () => {
      this.scene.launch('SettingsScene', { fromPause: true })
      this.scene.bringToTop('SettingsScene')
    })

    const menuBtn = this.add.text(width / 2, height / 2 + 90, 'В главное меню', TEXT_STYLE_BUTTON)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    this.addButtonHover(menuBtn)
    menuBtn.on('pointerdown', () => {
      this.scene.stop('GameScene')
      this.scene.stop('UIScene')
      this.scene.stop('PauseScene')
      this.scene.start('MenuScene')
      this.scene.bringToTop('MenuScene')
    })

    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    escKey.once('down', () => {
      this.scene.resume('GameScene')
      this.scene.resume('UIScene')
      this.scene.stop('PauseScene')
    })
  }

  private addButtonHover(text: Phaser.GameObjects.Text) {
    text.on('pointerover', () => text.setColor('#a29bfe'))
    text.on('pointerout', () => text.setColor('#ffffff'))
  }
}
