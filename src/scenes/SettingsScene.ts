import Phaser from 'phaser'
import { TEXT_STYLE_TITLE, TEXT_STYLE_BUTTON, TEXT_STYLE_SUB } from '../styles/textStyles'

// Minimal, predictable Settings Scene with two modes: arrows or keys
export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' })
  }

  private bindings: { left: string; right: string; up: string; down: string } = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    up: 'ArrowUp',
    down: 'ArrowDown',
  }
  private bindingMode: 'left'|'right'|'up'|'down'|null = null
  private volume: number = 0.5

  create() {
    const { width, height } = this.scale
    const PANEL_LEFT = width / 2 - 260
    const PANEL_TOP = height / 2 - 180
    const PANEL_W = 520
    const PANEL_H = 360

    // Panel
    const panel = this.add.graphics()
    panel.fillStyle(0x111f2b, 0.95)
    panel.fillRoundedRect(PANEL_LEFT, PANEL_TOP, PANEL_W, PANEL_H, 14)
    panel.lineStyle(2, 0x3a7bd5)
    panel.strokeRoundedRect(PANEL_LEFT, PANEL_TOP, PANEL_W, PANEL_H, 14)

    // Title
    this.add.text(width / 2, PANEL_TOP - 28, 'Настройки', TEXT_STYLE_TITLE).setOrigin(0.5)

    // Volume slider (kept simple)
    const TRACK_W = 320
    const TRACK_H = 10
    const TRACK_LEFT = PANEL_LEFT + (PANEL_W - TRACK_W) / 2
    const TRACK_Y = PANEL_TOP + 80
    this.add.text(PANEL_LEFT + PANEL_W / 2, TRACK_Y - 30, 'Громкость', TEXT_STYLE_SUB).setOrigin(0.5)
    const track = this.add.graphics()
    track.fillStyle(0x555555, 1)
    track.fillRect(TRACK_LEFT, TRACK_Y - TRACK_H / 2, TRACK_W, TRACK_H)
    const savedVol = localStorage.getItem('volume')
    this.volume = savedVol ? parseFloat(savedVol) : 0.5
    if (isNaN(this.volume)) this.volume = 0.5
    const knob = this.add.circle(TRACK_LEFT + this.volume * TRACK_W, TRACK_Y, 9, 0xffffff).setInteractive({ draggable: true })
    const volumeLabel = this.add.text(
      PANEL_LEFT + PANEL_W / 2 + TRACK_W / 2 + 40,
      TRACK_Y,
      Math.round(this.volume * 100) + '%',
      { font: '14px monospace', color: '#fff' }
    ).setOrigin(0.5)

    knob.on('drag', (_p: Phaser.Input.Pointer, dragX: number) => {
      const nx = Phaser.Math.Clamp(dragX, TRACK_LEFT, TRACK_LEFT + TRACK_W)
      knob.x = nx
      this.volume = (nx - TRACK_LEFT) / TRACK_W
      localStorage.setItem('volume', this.volume.toFixed(3))
      volumeLabel.setText(Math.round(this.volume * 100) + '%')
      try { if ((this.sound as any)?.setVolume) (this.sound as any).setVolume(this.volume) } catch {}
    })
    volumeLabel.setText(Math.round(this.volume * 100) + '%')

    // Controls section
    const MODE_Y = PANEL_TOP + 150
    this.add.text(PANEL_LEFT + PANEL_W / 2, MODE_Y - 22, 'Управление', TEXT_STYLE_SUB).setOrigin(0.5)

    const DIR_Y0 = MODE_Y + 30
    const listY0 = DIR_Y0
    const listX = PANEL_LEFT + 60
    const listUp = this.add.text(listX, listY0, '', TEXT_STYLE_SUB)
    const listLeft = this.add.text(listX, listY0 + 28, '', TEXT_STYLE_SUB)
    const listRight = this.add.text(listX, listY0 + 56, '', TEXT_STYLE_SUB)
    const listDown = this.add.text(listX, listY0 + 84, '', TEXT_STYLE_SUB)

    const loadBindings = () => {
      const stored = localStorage.getItem('bindings')
      if (!stored) {
        return this.bindings
      }

      try {
        const parsed = JSON.parse(stored) as { left?: string; right?: string; up?: string; down?: string }
        this.bindings = {
          left: parsed.left || this.bindings.left,
          right: parsed.right || this.bindings.right,
          up: parsed.up || this.bindings.up,
          down: parsed.down || this.bindings.down
        }
      } catch {
        this.bindings = this.bindings
      }

      return this.bindings
    }

    const saveBindings = () => {
      localStorage.setItem('bindings', JSON.stringify(this.bindings))
    }

    this.bindings = loadBindings()

    const codeToLabel = (code: string): string => {
      if (code === 'ArrowUp') return '↑'
      if (code === 'ArrowDown') return '↓'
      if (code === 'ArrowLeft') return '←'
      if (code === 'ArrowRight') return '→'
      if (code.startsWith('Arrow')) return code.substring(5)
      if (code.startsWith('Key')) return code.slice(3)
      if (code.startsWith('Digit')) return code.slice(5)
      if (code === 'Space') return 'Space'
      return code
    }

    const renderDirection = () => {
      const upLabel = codeToLabel(this.bindings.up)
      const leftLabel = codeToLabel(this.bindings.left)
      const rightLabel = codeToLabel(this.bindings.right)
      const downLabel = codeToLabel(this.bindings.down)

      listUp.setText('Вверх: ' + upLabel)
      listLeft.setText('Влево: ' + leftLabel)
      listRight.setText('Вправо: ' + rightLabel)
      listDown.setText('Вниз: ' + downLabel)
    }
    renderDirection()

    listUp.setInteractive({ useHandCursor: true })
    listLeft.setInteractive({ useHandCursor: true })
    listRight.setInteractive({ useHandCursor: true })
    listDown.setInteractive({ useHandCursor: true })
    listUp.on('pointerdown', () => { this.bindingMode = 'up' })
    listLeft.on('pointerdown', () => { this.bindingMode = 'left' })
    listRight.on('pointerdown', () => { this.bindingMode = 'right' })
    listDown.on('pointerdown', () => { this.bindingMode = 'down' })

    const keyboard = this.input.keyboard
    if (keyboard) {
      keyboard.on('keydown', (ev: KeyboardEvent) => {
        if (!this.bindingMode) return
        const code = ev.code

        if (code === 'KeyI') return

        const usedByOther =
          (this.bindingMode !== 'left' && this.bindings.left === code) ||
          (this.bindingMode !== 'right' && this.bindings.right === code) ||
          (this.bindingMode !== 'up' && this.bindings.up === code) ||
          (this.bindingMode !== 'down' && this.bindings.down === code)

        if (usedByOther) return

        switch (this.bindingMode) {
          case 'left':
            this.bindings.left = code
            break
          case 'right':
            this.bindings.right = code
            break
          case 'up':
            this.bindings.up = code
            break
          case 'down':
            this.bindings.down = code
            break
        }
        saveBindings()
        this.bindingMode = null
        renderDirection()
      })
    }

    const reset = this.add.text(PANEL_LEFT + PANEL_W - 90, PANEL_TOP + PANEL_H - 40, 'Сбросить', TEXT_STYLE_BUTTON)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    reset.on('pointerdown', () => {
      this.bindings = {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        up: 'ArrowUp',
        down: 'ArrowDown'
      }
      this.bindingMode = null
      saveBindings()
      renderDirection()
    })

    const back = this.add.text(PANEL_LEFT + 90, PANEL_TOP + PANEL_H - 40, 'Назад', TEXT_STYLE_BUTTON).setOrigin(0.5).setInteractive({ useHandCursor: true })
    back.on('pointerdown', () => this.scene.start('MenuScene'))
  }
}
