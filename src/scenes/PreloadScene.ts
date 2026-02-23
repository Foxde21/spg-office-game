import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.createLoadingBar()
    this.load.atlas('villagers', 'assets/Villagers/VillagersSheetPNG.png', 'assets/Villagers/villagers-atlas.json')
  }

  private createLoadingBar() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    const progressBox = this.add.graphics()
    const progressBar = this.add.graphics()

    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Загрузка...', {
      font: '20px Arial',
      color: '#ffffff',
    })
    loadingText.setOrigin(0.5, 0.5)

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      color: '#ffffff',
    })
    percentText.setOrigin(0.5, 0.5)

    this.load.on('progress', (value: number) => {
      percentText.setText(Math.round(value * 100) + '%')
      progressBar.clear()
      progressBar.fillStyle(0x6c5ce7, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error('Load error:', file.key, file.url)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
    })
  }

  create() {
    this.createAnimations()
    this.createPlaceholderAssets()
    this.scene.start('GameScene')
  }

  private createAnimations() {
    this.anims.create({
      key: 'player-idle-down',
      frames: [{ key: 'villagers', frame: 'player-down-1' }],
      frameRate: 1,
    })

    this.anims.create({
      key: 'player-idle-up',
      frames: [{ key: 'villagers', frame: 'player-up-1' }],
      frameRate: 1,
    })

    this.anims.create({
      key: 'player-idle-right',
      frames: [{ key: 'villagers', frame: 'player-right-1' }],
      frameRate: 1,
    })

    this.anims.create({
      key: 'player-idle-left',
      frames: [{ key: 'villagers', frame: 'player-right-1' }],
      frameRate: 1,
    })

    this.anims.create({
      key: 'player-walk-down',
      frames: [
        { key: 'villagers', frame: 'player-down-0' },
        { key: 'villagers', frame: 'player-down-2' },
        { key: 'villagers', frame: 'player-down-1' },
      ],
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'player-walk-up',
      frames: [
        { key: 'villagers', frame: 'player-up-0' },
        { key: 'villagers', frame: 'player-up-2' },
        { key: 'villagers', frame: 'player-up-1' },
      ],
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'player-walk-right',
      frames: [
        { key: 'villagers', frame: 'player-right-0' },
        { key: 'villagers', frame: 'player-right-2' },
        { key: 'villagers', frame: 'player-right-1' },
      ],
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'player-walk-left',
      frames: [
        { key: 'villagers', frame: 'player-right-2' },
        { key: 'villagers', frame: 'player-right-0' },
        { key: 'villagers', frame: 'player-right-1' },
      ],
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'timlead-idle-down',
      frames: [{ key: 'villagers', frame: 'timlead-down-1' }],
      frameRate: 1,
    })

    this.anims.create({
      key: 'hr-idle-down',
      frames: [{ key: 'villagers', frame: 'hr-down-1' }],
      frameRate: 1,
    })
  }

  private createPlaceholderAssets() {
    const playerGraphics = this.make.graphics({ x: 0, y: 0 })
    playerGraphics.fillStyle(0x6c5ce7)
    playerGraphics.fillRect(0, 0, 48, 64)
    playerGraphics.generateTexture('player', 48, 64)
    playerGraphics.destroy()

    const npcGraphics = this.make.graphics({ x: 0, y: 0 })
    npcGraphics.fillStyle(0xe17055)
    npcGraphics.fillRect(0, 0, 48, 64)
    npcGraphics.generateTexture('npc', 48, 64)
    npcGraphics.destroy()

    const itemGraphics = this.make.graphics({ x: 0, y: 0 })
    itemGraphics.fillStyle(0x00b894)
    itemGraphics.fillRect(0, 0, 32, 32)
    itemGraphics.generateTexture('item', 32, 32)
    itemGraphics.destroy()

    const floorGraphics = this.make.graphics({ x: 0, y: 0 })
    floorGraphics.fillStyle(0x4a4a6a)
    floorGraphics.fillRect(0, 0, 64, 64)
    floorGraphics.lineStyle(1, 0x3a3a5a)
    floorGraphics.strokeRect(0, 0, 64, 64)
    floorGraphics.generateTexture('floor', 64, 64)
    floorGraphics.destroy()

    const wallGraphics = this.make.graphics({ x: 0, y: 0 })
    wallGraphics.fillStyle(0x2d2d44)
    wallGraphics.fillRect(0, 0, 64, 64)
    wallGraphics.lineStyle(2, 0x1a1a2e)
    wallGraphics.strokeRect(0, 0, 64, 64)
    wallGraphics.generateTexture('wall', 64, 64)
    wallGraphics.destroy()
  }
}
