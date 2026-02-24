import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON, TEXT_STYLE_SUB } from '../styles/textStyles'

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' })
  }

  create() {
    const { width, height } = this.scale
    // Title
    this.add.text(width / 2, height / 2 - 200, 'Настройки', TEXT_STYLE_TITLE).setOrigin(0.5)

    // Volume track
    const trackW = 260
    const trackH = 12
    const left = width / 2 - trackW / 2
    const centerY = height / 2 - 60
    const track = this.add.graphics()
    track.fillStyle(0x666666, 1)
    track.fillRect(left, centerY - trackH / 2, trackW, trackH)

    let volume = parseFloat(localStorage.getItem('volume') ?? '0.5')
    if (isNaN(volume)) volume = 0.5
    const knob = this.add.circle(left + volume * trackW, centerY, 8, 0xffffff).setInteractive({ draggable: true })
    knob.on('drag', (_pointer, dragX) => {
      const nx = Phaser.Math.Clamp(dragX, left, left + trackW)
      knob.x = nx
      volume = (nx - left) / trackW
      localStorage.setItem('volume', volume.toFixed(3))
      try {
        // Try apply to sound subsystem
        if ((this.sound as any)?.setVolume) (this.sound as any).setVolume(volume)
        else if ((this.game as any).sound?.setVolume) (this.game as any).sound.setVolume(volume)
      } catch {}
    })
    const volLabel = this.add.text(width / 2 + trackW / 2 + 20, centerY, Math.round(volume * 100) + '%', {
      font: '14px monospace',
      fill: '#fff'
    }).setOrigin(0.5)
    knob.on('drag', () => {
      volLabel.setText(Math.round(volume * 100) + '%')
    })

    // Control scheme
    const csY = centerY + 60
    this.add.text(width / 2, csY - 20, 'Управление', TEXT_STYLE_BUTTON).setOrigin(0.5)
    const arrows = this.add.text(width / 2 - 60, csY, 'Arrows', TEXT_STYLE_BUTTON).setInteractive({ useHandCursor: true })
    const wasd = this.add.text(width / 2 + 20, csY, 'WASD', TEXT_STYLE_BUTTON).setInteractive({ useHandCursor: true })
    let scheme = localStorage.getItem('controlScheme') ?? 'arrows'
    const applyUI = () => {
      arrows.setBackgroundColor(scheme === 'arrows' ? '#555' : null)
      wasd.setBackgroundColor(scheme === 'wasd' ? '#555' : null)
    }
    arrows.on('pointerdown', () => { scheme = 'arrows'; localStorage.setItem('controlScheme', 'arrows'); applyUI() })
    wasd.on('pointerdown', () => { scheme = 'wasd'; localStorage.setItem('controlScheme', 'wasd'); applyUI() })
    applyUI()

    // Back button
    const back = this.add.text(width / 2, height / 2 + 180, 'Назад', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    back.on('pointerdown', () => {
      this.scene.stop()
      // Return to MenuScene if it is loaded
      this.scene.resume('MenuScene')
    })
  }
}
