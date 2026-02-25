import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON } from '../styles/textStyles'

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' })
  }

  create() {
    const { width, height } = this.scale

    const bg = this.add.graphics()
    bg.fillStyle(0x0a0a18, 0.95)
    bg.fillRect(0, 0, width, height)

    this.add.text(width / 2, height / 2 - 80, 'Победа!', TEXT_STYLE_TITLE).setOrigin(0.5)
    this.add.text(width / 2, height / 2 - 30, 'Вы достигли уровня Team Lead', {
      fontSize: '22px',
      color: '#00b894'
    }).setOrigin(0.5)

    const menuBtn = this.add.text(width / 2, height / 2 + 50, 'В главное меню', TEXT_STYLE_BUTTON)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
    menuBtn.on('pointerover', () => menuBtn.setColor('#a29bfe'))
    menuBtn.on('pointerout', () => menuBtn.setColor('#ffffff'))
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'))
  }
}
