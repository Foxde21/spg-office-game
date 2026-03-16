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
    animKey: string,
    id: string,
    name: string,
    role: string,
    dialogues: Dialogue[],
    isAI = false
  ) {
    super(scene, x, y, 'villagers')
    
    this.npcId = id
    this.npcName = name
    this.role = role
    this.dialogues = dialogues
    this.isAI = isAI
    
    scene.physics.add.existing(this)
    this.setImmovable(true)
    this.setScale(2)
    this.setOrigin(0.5, 0.5)
    
    this.body!.setSize(16, 20)
    this.body!.setOffset(8, 22)
    
    this.play(`${animKey}-idle-down`)
    
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

  getDialogue():
    | { npcId: string; name: string; isAI: true }
    | { npcId: string; name: string; role: string; dialogues: Dialogue[]; startId?: string } {
    if (this.isAI) {
      return { npcId: this.npcId, name: this.npcName, isAI: true }
    }

    let startId = this.dialogues[0]?.id

    const game = (this.scene as any)?.game
    const gameState = game?.registry?.get ? game.registry.get('gameState') : undefined
    const respect = typeof gameState?.getRespect === 'function' ? gameState.getRespect() : 0
    const careerPathChosen =
      typeof gameState?.getFlag === 'function' ? Boolean(gameState.getFlag('careerPathChosen')) : false
    const careerPath =
      typeof gameState?.getCareerPath === 'function' ? (gameState.getCareerPath() as string | undefined) : undefined

    if (respect >= 20 && !careerPathChosen) {
      const careerChoice = this.dialogues.find((d) => d.id.startsWith('career-choice-'))
      if (careerChoice) {
        startId = careerChoice.id
      }
    }

    if (careerPathChosen && careerPath) {
      const reaction = this.dialogues.find((d) => d.id === `career-react-${careerPath}`)
      if (reaction) {
        startId = reaction.id
      }
    }

    return { npcId: this.npcId, name: this.npcName, role: this.role, dialogues: this.dialogues, startId }
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
