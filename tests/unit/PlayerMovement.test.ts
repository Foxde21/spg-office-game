import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Physics: {
      Arcade: {
        Sprite: class MockSprite {}
      }
    }
  }
}))

describe('Player movement', () => {
  let PlayerClass: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../src/objects/Player')
    PlayerClass = mod.Player
  })

  const createFakePlayer = () => {
    const player: any = Object.create(PlayerClass.prototype)
    player.body = {
      velocity: { x: 0, y: 0 }
    }
    player.anims = {
      currentAnim: { key: 'player-idle-down' }
    }
    player.play = vi.fn()
    player.setFlipX = vi.fn()
    player.lastDirection = 'down'
    Object.defineProperty(player, 'speed', { value: 200, writable: true, configurable: true })

    return player
  }

  it('moves left when left input is true', () => {
    const player = createFakePlayer()

    player.update({ left: true, right: false, up: false, down: false })

    expect(player.body.velocity.x).toBe(-200)
    expect(player.body.velocity.y).toBe(0)
    expect(player.lastDirection).toBe('left')
  })

  it('moves right when right input is true', () => {
    const player = createFakePlayer()

    player.update({ left: false, right: true, up: false, down: false })

    expect(player.body.velocity.x).toBe(200)
    expect(player.body.velocity.y).toBe(0)
    expect(player.lastDirection).toBe('right')
  })

  it('moves up when up input is true', () => {
    const player = createFakePlayer()

    player.update({ left: false, right: false, up: true, down: false })

    expect(player.body.velocity.y).toBe(-200)
    expect(player.lastDirection).toBe('up')
  })

  it('moves down when down input is true', () => {
    const player = createFakePlayer()

    player.update({ left: false, right: false, up: false, down: true })

    expect(player.body.velocity.y).toBe(200)
    expect(player.lastDirection).toBe('down')
  })

  it('normalizes diagonal movement', () => {
    const player = createFakePlayer()

    player.update({ left: true, right: false, up: true, down: false })

    expect(player.body.velocity.x).toBeCloseTo(-141.4, 1)
    expect(player.body.velocity.y).toBeCloseTo(-141.4, 1)
  })

  it('stays idle when no input', () => {
    const player = createFakePlayer()

    player.update({ left: false, right: false, up: false, down: false })

    expect(player.body.velocity.x).toBe(0)
    expect(player.body.velocity.y).toBe(0)
  })
})

