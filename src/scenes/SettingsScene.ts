import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON, TEXT_STYLE_SUB } from '../styles/textStyles'

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' })
  }

  private volume!: number
  private volKnob?: Phaser.GameObjects.Arc
  create() {
    const { width, height } = this.scale
    // panel backdrop
    const panel = this.add.graphics()
    panel.fillStyle(0x111f2b, 0.95)
    panel.fillRoundedRect(width / 2 - 260, height / 2 - 180, 520, 360, 14)
    panel.lineStyle(2, 0x3a7bd5)
    panel.strokeRoundedRect(width / 2 - 260, height / 2 - 180, 520, 360, 14)

    // Title
    this.add.text(width / 2, height / 2 - 160, 'Настройки', TEXT_STYLE_TITLE).setOrigin(0.5)

    // Volume track (custom slider)
    const trackW = 320
    const trackH = 10
    const left = width / 2 - trackW / 2
    const trackY = height / 2 - 40
    const track = this.add.graphics()
    track.fillStyle(0x555555, 1)
    track.fillRect(left, trackY - trackH / 2, trackW, trackH)
    // Load volume from storage
    this.volume = parseFloat(localStorage.getItem('volume') ?? '0.5')
    if (isNaN(this.volume)) this.volume = 0.5
    const knob = this.add.circle(left + this.volume * trackW, trackY, 9, 0xffffff).setInteractive({ draggable: true })
    knob.on('drag', (_p, dragX) => {
      const nx = Phaser.Math.Clamp(dragX, left, left + trackW)
      knob.x = nx
      this.volume = (nx - left) / trackW
      localStorage.setItem('volume', this.volume.toFixed(3))
      try {
        if ((this.sound as any)?.setVolume) (this.sound as any).setVolume(this.volume)
      } catch {}
    })
    this.add.text(width / 2 + trackW / 2 + 20, trackY, Math.round(this.volume * 100) + '%', { font: '14px monospace', fill: '#fff' }).setOrigin(0.5)

    // Control scheme toggles
    const csY = height / 2 + 40
    this.add.text(width / 2, csY - 24, 'Управление', TEXT_STYLE_SUB).setOrigin(0.5)
    const arrows = this.add.text(width / 2 - 60, csY, 'Arrows', TEXT_STYLE_BUTTON).setInteractive({ useHandCursor: true })
    const wasd = this.add.text(width / 2 + 60, csY, 'WASD', TEXT_STYLE_BUTTON).setInteractive({ useHandCursor: true })
    let scheme = localStorage.getItem('controlScheme') ?? 'arrows'
    const refreshUI = () => {
      arrows.setBackgroundColor(scheme === 'arrows' ? '#555' : null)
      wasd.setBackgroundColor(scheme === 'wasd' ? '#555' : null)
    }
    arrows.on('pointerdown', () => { scheme = 'arrows'; localStorage.setItem('controlScheme', 'arrows'); refreshUI() })
    wasd.on('pointerdown', () => { scheme = 'wasd'; localStorage.setItem('controlScheme', 'wasd'); refreshUI() })
    refreshUI()

    // Back button
    const back = this.add.text(width / 2, height / 2 + 120, 'Назад', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    back.on('pointerdown', () => {
      this.scene.start('MenuScene')
    })
  }
}
