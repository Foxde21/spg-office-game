import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {
      constructor(..._args: any[]) {}
    }
  }
}))

describe('UIScene toast notifications', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('case 1: shows success toast only for newly unlocked assessment domains', async () => {
    vi.resetModules()

    const mod = await import('../../src/scenes/UIScene')
    const UISceneClass = mod.UIScene as any

    const baselineDomains = [
      { id: 'd1', name: 'Domain 1' },
      { id: 'd2', name: 'Domain 2' }
    ]
    const unlockedDomain = { id: 'd3', name: 'Domain 3' }

    const assessmentMock = {
      startAssessmentSession: vi.fn(),
      submitAnswer: vi.fn(),
      getAvailableDomains: vi.fn().mockReturnValue(baselineDomains),
      getDomainProgress: vi.fn(),
      getAssessmentState: vi.fn(),
      getCurrentLevel: vi.fn().mockReturnValue(null),
      getAverageScore: vi.fn().mockReturnValue(0),
      resetDomainProgress: vi.fn(),
      promote: vi.fn()
    }

    const mockGame = {
      registry: {
        get: vi.fn((key: string) => (key === 'assessmentManager' ? assessmentMock : undefined))
      }
    }

    const scene: any = new UISceneClass()
    scene.game = mockGame
    scene.toastManager = { show: vi.fn() }

    scene.refreshAssessmentModules(true)

    expect(scene.toastManager.show).not.toHaveBeenCalled()

    assessmentMock.getAvailableDomains.mockReturnValue([...baselineDomains, unlockedDomain])
    scene.refreshAssessmentModules(true)

    expect(scene.toastManager.show).toHaveBeenCalledTimes(1)
    expect(scene.toastManager.show).toHaveBeenCalledWith({
      text: 'Открыт новый модуль: Domain 3',
      variant: 'success',
      durationMs: 4000
    })
  })

  it('case 2: shows success toast on careerLevelUp with the same title as HUD source', async () => {
    vi.resetModules()

    const mod = await import('../../src/scenes/UIScene')
    const UISceneClass = mod.UIScene as any

    const scene: any = new UISceneClass()
    scene.toastManager = { show: vi.fn() }
    scene.updateBars = vi.fn()

    let careerLevel = 'junior'
    scene.gameState = {
      getCareerPath: vi.fn().mockReturnValue(undefined),
      getCareerLevel: vi.fn(() => careerLevel),
      setCareerLevel: vi.fn((id: string) => {
        careerLevel = id
      })
    }

    scene.onCareerLevelUp({ level: 'middle' })

    const calls = (scene.toastManager.show as unknown as { mock: { calls: any[][] } }).mock.calls
    expect(calls.length).toBe(1)

    const payload = calls[0][0]
    expect(payload.variant).toBe('success')
    expect(payload.durationMs).toBe(4000)
    expect(String(payload.text)).toContain('Повышение!')
    expect(String(payload.text)).toContain('Middle Developer')
  })

  it('case 3: shows toast on quest start and quest completion', async () => {
    vi.resetModules()

    const mod = await import('../../src/scenes/UIScene')
    const UISceneClass = mod.UIScene as any

    const scene: any = new UISceneClass()
    scene.toastManager = { show: vi.fn() }
    scene.updateQuestPanel = vi.fn()

    scene.onQuestStarted({ title: 'Сделать документацию' })
    scene.onQuestCompleted({ title: 'Сделать документацию' })

    expect(scene.toastManager.show).toHaveBeenCalledTimes(2)
    expect(scene.toastManager.show).toHaveBeenNthCalledWith(1, {
      text: 'Квест начат: Сделать документацию',
      variant: 'info',
      durationMs: 4000
    })
    expect(scene.toastManager.show).toHaveBeenNthCalledWith(2, {
      text: 'Квест выполнен: Сделать документацию',
      variant: 'success',
      durationMs: 4000
    })
  })
})
