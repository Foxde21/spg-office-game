import { describe, it, expect, beforeEach, vi } from 'vitest'

let capturedBackPointerdown: (() => void) | null = null

vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {},
    GameObjects: {
      Graphics: class MockGraphics {
        fillStyle = vi.fn().mockReturnThis()
        fillRect = vi.fn().mockReturnThis()
        lineStyle = vi.fn().mockReturnThis()
        strokeRoundedRect = vi.fn().mockReturnThis()
        fillRoundedRect = vi.fn().mockReturnThis()
        setDepth = vi.fn().mockReturnThis()
      },
      Text: class MockText {
        setOrigin = vi.fn().mockReturnThis()
        setInteractive = vi.fn().mockReturnThis()
        setColor = vi.fn()
        setText = vi.fn()
        on = vi.fn((event: string, fn: () => void) => {
          if (event === 'pointerdown') capturedBackPointerdown = fn
          return this
        })
      },
      Container: class MockContainer {}
    },
    Input: {
      Keyboard: { KeyCodes: {} }
    },
    Math: {
      Clamp: (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    }
  }
}))

describe('SettingsScene', () => {
  let SettingsSceneClass: any

  beforeEach(async () => {
    vi.clearAllMocks()
    capturedBackPointerdown = null
    localStorage.clear()
    const mod = await import('../../src/scenes/SettingsScene')
    SettingsSceneClass = mod.SettingsScene
  })

  const createScene = (fromPause: boolean) => {
    const scene: any = new SettingsSceneClass()
    const stop = vi.fn()
    const bringToTop = vi.fn()
    scene.scale = { width: 1280, height: 720 }
    scene.scene = {
      settings: { data: { fromPause } },
      stop,
      bringToTop
    }
    scene.add = {
      graphics: vi.fn().mockReturnValue({
        fillStyle: vi.fn().mockReturnThis(),
        fillRect: vi.fn().mockReturnThis(),
        lineStyle: vi.fn().mockReturnThis(),
        strokeRoundedRect: vi.fn().mockReturnThis(),
        fillRoundedRect: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis()
      }),
      text: vi.fn().mockReturnValue({
        setOrigin: vi.fn().mockReturnThis(),
        setInteractive: vi.fn().mockReturnThis(),
        setColor: vi.fn(),
        setText: vi.fn(),
        on: vi.fn((event: string, fn: () => void) => {
          if (event === 'pointerdown') capturedBackPointerdown = fn
          return { setOrigin: vi.fn().mockReturnThis(), setInteractive: vi.fn().mockReturnThis(), setColor: vi.fn(), setText: vi.fn(), on: vi.fn() }
        })
      }),
      circle: vi.fn().mockReturnValue({
        setInteractive: vi.fn().mockReturnThis(),
        on: vi.fn(),
        x: 0
      })
    }
    scene.input = { keyboard: { on: vi.fn() } }
    scene.time = { delayedCall: vi.fn() }
    scene.sound = {}
    return { scene, stop, bringToTop }
  }

  it('calls only stop(SettingsScene) when back is clicked and fromPause is true', () => {
    const { scene, stop, bringToTop } = createScene(true)
    scene.create()
    expect(capturedBackPointerdown).not.toBeNull()
    capturedBackPointerdown!()

    expect(stop).toHaveBeenCalledWith('SettingsScene')
    expect(stop).toHaveBeenCalledTimes(1)
    expect(bringToTop).not.toHaveBeenCalled()
  })

  it('calls stop(SettingsScene) and bringToTop(MenuScene) when back is clicked and fromPause is false', () => {
    const { scene, stop, bringToTop } = createScene(false)
    scene.create()
    expect(capturedBackPointerdown).not.toBeNull()
    capturedBackPointerdown!()

    expect(stop).toHaveBeenCalledWith('SettingsScene')
    expect(bringToTop).toHaveBeenCalledWith('MenuScene')
  })
})
