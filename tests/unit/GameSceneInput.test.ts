import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {},
    Physics: {
      Arcade: {
        Sprite: class MockSprite {}
      }
    },
    GameObjects: {
      Container: class MockContainer {},
      Text: class MockText {},
      Graphics: class MockGraphics {},
      Sprite: class MockSprite {}
    },
    Input: {
      Keyboard: {
        KeyCodes: { E: 'E' },
        JustDown: () => false
      }
    }
  }
}))

describe('GameScene movement bindings', () => {
  let GameSceneClass: any

  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()
    const mod = await import('../../src/scenes/GameScene')
    GameSceneClass = mod.GameScene
  })

  const createScene = () => {
    const scene: any = new GameSceneClass()
    const addKey = vi.fn().mockReturnValue({})
    const on = vi.fn()
    scene.input = {
      keyboard: {
        addKey,
        on
      }
    }

    return { scene, addKey, on }
  }

  it('uses default bindings when storage is empty', () => {
    const { scene, addKey } = createScene()

    ;(scene as any).setupInput()

    expect((scene as any).moveBindings).toEqual({
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown'
    })
    expect(addKey).toHaveBeenCalled()
  })

  it('merges bindings from storage with defaults', () => {
    localStorage.setItem('bindings', JSON.stringify({ left: 'KeyA', up: 'KeyW' }))
    const { scene } = createScene()

    ;(scene as any).setupInput()

    expect((scene as any).moveBindings).toEqual({
      left: 'KeyA',
      right: 'ArrowRight',
      up: 'KeyW',
      down: 'ArrowDown'
    })
  })
})
