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

    const game = this.scene.game
    const gameState = typeof game.registry?.get === 'function' ? (game.registry.get('gameState') as unknown) : undefined
    const respect =
      gameState && typeof (gameState as { getRespect?: unknown }).getRespect === 'function'
        ? (gameState as { getRespect: () => number }).getRespect()
        : 0
    const careerPathChosen =
      gameState && typeof (gameState as { getFlag?: unknown }).getFlag === 'function'
        ? Boolean((gameState as { getFlag: (id: string) => unknown }).getFlag('careerPathChosen'))
        : false
    const careerPath =
      gameState && typeof (gameState as { getCareerPath?: unknown }).getCareerPath === 'function'
        ? ((gameState as { getCareerPath: () => unknown }).getCareerPath() as string | undefined)
        : undefined

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
