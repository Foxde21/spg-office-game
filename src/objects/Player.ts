import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed = 200
  private lastDirection: 'down' | 'left' | 'up' | 'right' = 'down'

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'villagers')
    
    scene.physics.add.existing(this)
    this.setCollideWorldBounds(true)
    this.setScale(2)
    this.setOrigin(0.5, 0.5)
    
    this.body!.setSize(16, 20)
    this.body!.setOffset(8, 22)
    
    this.play('player-idle-down')
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!this.body) return

    this.body.velocity.x = 0
    this.body.velocity.y = 0

    let moving = false

    if (cursors.left.isDown) {
      this.body.velocity.x = -this.speed
      this.lastDirection = 'left'
      moving = true
    } else if (cursors.right.isDown) {
      this.body.velocity.x = this.speed
      this.lastDirection = 'right'
      moving = true
    }

    if (cursors.up.isDown) {
      this.body.velocity.y = -this.speed
      this.lastDirection = 'up'
      moving = true
    } else if (cursors.down.isDown) {
      this.body.velocity.y = this.speed
      this.lastDirection = 'down'
      moving = true
    }

    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      this.body.velocity.x *= 0.707
      this.body.velocity.y *= 0.707
    }

    this.updateAnimation(moving)
  }

  private updateAnimation(moving: boolean) {
    const dir = this.lastDirection
    const anim = moving ? `player-walk-${dir}` : `player-idle-${dir}`
    
    this.setFlipX(dir === 'left')
    
    const actualAnim = dir === 'left' 
      ? (moving ? 'player-walk-right' : 'player-idle-right')
      : anim
    
    if (this.anims.currentAnim?.key !== actualAnim) {
      this.play(actualAnim)
    }
  }
}
