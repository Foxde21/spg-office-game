import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed = 200

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
    this.setScale(1)
    
    this.body!.setSize(40, 60)
    this.body!.setOffset(4, 4)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!this.body) return

    this.body.velocity.x = 0
    this.body.velocity.y = 0

    if (cursors.left.isDown) {
      this.body.velocity.x = -this.speed
    } else if (cursors.right.isDown) {
      this.body.velocity.x = this.speed
    }

    if (cursors.up.isDown) {
      this.body.velocity.y = -this.speed
    } else if (cursors.down.isDown) {
      this.body.velocity.y = this.speed
    }

    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.x *= 0.707
      this.body.velocity.y *= 0.707
    }
  }
}
