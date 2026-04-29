import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {},
    GameObjects: {
      Container: class MockContainer {
        setAlpha = vi.fn()
      },
      Text: class MockText {
        setOrigin = vi.fn().mockReturnThis()
        setInteractive = vi.fn().mockReturnThis()
        setColor = vi.fn()
        on = vi.fn()
      }
    }
  }
}))

describe('MenuScene', () => {
  let MenuSceneClass: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../src/scenes/MenuScene')
    MenuSceneClass = mod.MenuScene
  })

  it('sets menuContent alpha to 0.4 when SettingsScene is active', () => {
    const scene: any = new MenuSceneClass()
    const setAlpha = vi.fn()
    scene.menuContent = { setAlpha }
    scene.scene = {
      manager: { isActive: vi.fn().mockReturnValue(true) }
    }

    scene.update()

    expect(scene.scene.manager.isActive).toHaveBeenCalledWith('SettingsScene')
    expect(setAlpha).toHaveBeenCalledWith(0.4)
  })

  it('sets menuContent alpha to 1 when SettingsScene is not active', () => {
    const scene: any = new MenuSceneClass()
    const setAlpha = vi.fn()
    scene.menuContent = { setAlpha }
    scene.scene = {
      manager: { isActive: vi.fn().mockReturnValue(false) }
    }

    scene.update()

    expect(scene.scene.manager.isActive).toHaveBeenCalledWith('SettingsScene')
    expect(setAlpha).toHaveBeenCalledWith(1)
  })

  it('does not call setAlpha when menuContent is missing', () => {
    const scene: any = new MenuSceneClass()
    scene.menuContent = undefined
    scene.scene = { manager: { isActive: vi.fn() } }

    expect(() => scene.update()).not.toThrow()
  })
})
