import Phaser from 'phaser'
import type { Dialogue } from '../types'

export class NPC extends Phaser.Physics.Arcade.Sprite {
  private npcId: string
  private npcName: string
  private role: string
  private dialogues: Dialogue[]
  private isAI: boolean

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    name: string,
    role: string,
    dialogues: Dialogue[],
    isAI = false
  ) {
    super(scene, x, y, texture)
    
    this.npcId = id
    this.npcName = name
    this.role = role
    this.dialogues = dialogues
    this.isAI = isAI
    
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

  getDialogue(): Dialogue | { npcId: string; name: string; isAI: true } {
    if (this.isAI) {
      return { npcId: this.npcId, name: this.npcName, isAI: true }
    }
    return this.dialogues[0]
  }

  getName(): string {
    return this.npcName
  }

  getRole(): string {
    return this.role
  }

  getId(): string {
    return this.npcId
  }

  isAINPC(): boolean {
    return this.isAI
  }
}
