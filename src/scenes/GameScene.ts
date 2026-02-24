import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {}

  create() {
    const { width, height } = this.scale
    // Simple floor grid
    const cols = Math.floor(width / 64)
    const rows = Math.floor(height / 64)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.add.image(c * 64 + 32, r * 64 + 32, 'floor')
      }
    }

    // Player
    this.player = this.physics.add.sprite(width / 2, height / 2, 'player')
    this.player.setCollideWorldBounds(true)
    this.cursors = this.input.keyboard.createCursorKeys()

    // NPC placeholder
    const npc = this.physics.add.staticImage(width / 2 + 100, height / 2, 'npc')
    this.physics.add.collider(this.player, npc)
  }

  update() {
    const speed = 180
    if (!this.player) return
    this.player.setVelocity(0)
    if (this.cursors.left?.isDown) this.player.setVelocityX(-speed)
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed)
    if (this.cursors.up?.isDown) this.player.setVelocityY(-speed)
    else if (this.cursors.down?.isDown) this.player.setVelocityY(speed)
  }
}
