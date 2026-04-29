import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON } from '../styles/textStyles'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' })
  }

  create() {
    const { width, height } = this.scale
    const reason = (this.scene.settings.data as { reason?: string }).reason ?? 'game_over'

    const bg = this.add.graphics()
    bg.fillStyle(0x000000, 0.9)
    bg.fillRect(0, 0, width, height)

    this.add.text(width / 2, height / 2 - 80, 'Игра окончена', TEXT_STYLE_TITLE).setOrigin(0.5)

    const reasonText = reason === 'burnout'
      ? 'Вы выгорели и уволились...'
      : reason === 'fired'
        ? 'Вас сократили'
        : 'Game Over'
    this.add.text(width / 2, height / 2 - 20, reasonText, {
      fontSize: '24px',
      color: '#e17055',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    const menuBtn = this.add.text(width / 2, height / 2 + 60, 'В главное меню', TEXT_STYLE_BUTTON)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    menuBtn.on('pointerover', () => menuBtn.setColor('#a29bfe'))
    menuBtn.on('pointerout', () => menuBtn.setColor('#ffffff'))
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'))
  }
}
