import Phaser from 'phaser'
import type { Dialogue } from '../types'

export class NPC extends Phaser.Physics.Arcade.Sprite {
  private npcName: string
  private role: string
  private dialogues: Dialogue[]

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    name: string,
    role: string,
    dialogues: Dialogue[]
  ) {
    super(scene, x, y, texture)
    
    this.npcName = name
    this.role = role
    this.dialogues = dialogues
    
    scene.physics.add.existing(this)
    this.setImmovable(true)
    
    this.createNameLabel(scene)
  }

  private createNameLabel(scene: Phaser.Scene) {
    const label = scene.add.text(this.x, this.y - 50, this.npcName, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 2 },
    })
    label.setOrigin(0.5)
  }

  getDialogue(): Dialogue {
    return this.dialogues[0]
  }

  getName(): string {
    return this.npcName
  }

  getRole(): string {
    return this.role
  }
}
