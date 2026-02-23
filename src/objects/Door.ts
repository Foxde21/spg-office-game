import Phaser from 'phaser'
import type { DoorData } from '../types/Location'

export class Door extends Phaser.GameObjects.Container {
  private doorData: DoorData
  private label: Phaser.GameObjects.Text
  private background: Phaser.GameObjects.Graphics
  private isHovered = false

  constructor(scene: Phaser.Scene, x: number, y: number, data: DoorData) {
    super(scene, x, y)
    this.doorData = data

    this.background = scene.add.graphics()
    this.drawDoor()

    this.label = scene.add.text(0, -60, data.label || data.targetLocation, {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#1a1a2e',
      padding: { x: 6, y: 3 },
    })
    this.label.setOrigin(0.5)

    this.add([this.background, this.label])

    this.setSize(60, 100)
    this.setInteractive({ useHandCursor: true })

    this.on('pointerover', this.onHover, this)
    this.on('pointerout', this.onOut, this)
  }

  private drawDoor() {
    this.background.clear()
    
    this.background.fillStyle(this.isHovered ? 0x6c5ce7 : 0x4a4a6a)
    this.background.fillRoundedRect(-30, -50, 60, 100, 8)
    
    this.background.lineStyle(2, this.isHovered ? 0xa29bfe : 0x6c5ce7)
    this.background.strokeRoundedRect(-30, -50, 60, 100, 8)
    
    this.background.fillStyle(0x2d2d44)
    this.background.fillCircle(20, 0, 5)
  }

  private onHover() {
    this.isHovered = true
    this.drawDoor()
  }

  private onOut() {
    this.isHovered = false
    this.drawDoor()
  }

  getDoorData(): DoorData {
    return this.doorData
  }
}
