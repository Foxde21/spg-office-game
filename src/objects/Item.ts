import Phaser from 'phaser'
import type { ItemData } from '../types'

export class Item extends Phaser.Physics.Arcade.Sprite {
  private itemData: ItemData

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    itemData: ItemData
  ) {
    super(scene, x, y, texture)
    
    this.itemData = itemData
    
    scene.physics.add.existing(this)
    this.setImmovable(true)
    this.body!.setSize(32, 32)
    
    this.createNameLabel(scene)
    this.createGlowEffect(scene)
  }

  private createNameLabel(scene: Phaser.Scene) {
    const label = scene.add.text(this.x, this.y - 30, this.itemData.name, {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 },
    })
    label.setOrigin(0.5)
  }

  private createGlowEffect(scene: Phaser.Scene) {
    scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  getItemData(): ItemData {
    return this.itemData
  }

  getId(): string {
    return this.itemData.id
  }
}
