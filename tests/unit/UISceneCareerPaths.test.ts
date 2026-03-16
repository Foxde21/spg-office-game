import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Scene: class MockScene {
      constructor(..._args: any[]) {}
    }
  }
}))

describe('UIScene career paths', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('expands showCareerPaths into unlocked paths and preserves other choices', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getAllCareerPaths: () => [
          { id: 'web', name: 'Web', unlockCondition: { minRespect: 0 } },
          { id: 'ai', name: 'AI', unlockCondition: { minRespect: 20 } },
          { id: 'secret', name: 'Secret', unlockCondition: { requiredFlag: 'flagA' } },
          { id: 'quested', name: 'Quested', unlockCondition: { requiredQuest: 'q1' } }
        ]
      }
    })

    const mod = await import('../../src/scenes/UIScene')
    const UISceneClass = mod.UIScene as any

    const scene: any = new UISceneClass()
    scene.gameState = {
      getRespect: vi.fn().mockReturnValue(25),
      getFlag: vi.fn((id: string) => id === 'flagA')
    }
    scene.questManager = {
      isQuestCompleted: vi.fn((id: string) => id === 'q1')
    }

    const original = [
      { text: 'A' },
      { text: 'Show', action: 'showCareerPaths' },
      { text: 'B' }
    ]

    const expanded = scene.expandCareerPathsChoices(original)

    expect(expanded.map((c: any) => c.text)).toEqual(['A', 'Web', 'AI', 'Secret', 'Quested', 'B'])
    expect(expanded.some((c: any) => c.action === 'showCareerPaths')).toBe(false)
    expect(expanded[1].action).toBe('setFlag:careerPathChosen;setCareerPath:web')
    expect(expanded[2].action).toBe('setFlag:careerPathChosen;setCareerPath:ai')
  })

  it('filters locked paths by unlockCondition', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getAllCareerPaths: () => [
          { id: 'web', name: 'Web', unlockCondition: { minRespect: 0 } },
          { id: 'ai', name: 'AI', unlockCondition: { minRespect: 20 } },
          { id: 'secret', name: 'Secret', unlockCondition: { requiredFlag: 'flagA' } },
          { id: 'quested', name: 'Quested', unlockCondition: { requiredQuest: 'q1' } }
        ]
      }
    })

    const mod = await import('../../src/scenes/UIScene')
    const UISceneClass = mod.UIScene as any

    const scene: any = new UISceneClass()
    scene.gameState = {
      getRespect: vi.fn().mockReturnValue(10),
      getFlag: vi.fn().mockReturnValue(false)
    }
    scene.questManager = {
      isQuestCompleted: vi.fn().mockReturnValue(false)
    }

    const original = [{ text: 'Show', action: 'showCareerPaths' }]
    const expanded = scene.expandCareerPathsChoices(original)

    expect(expanded.map((c: any) => c.text)).toEqual(['Web'])
  })

  it('returns choices unchanged when showCareerPaths is absent', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return { getAllCareerPaths: () => [{ id: 'ai', name: 'AI' }] }
    })

    const mod = await import('../../src/scenes/UIScene')
    const UISceneClass = mod.UIScene as any

    const scene: any = new UISceneClass()
    scene.gameState = { getRespect: vi.fn().mockReturnValue(25), getFlag: vi.fn().mockReturnValue(true) }
    scene.questManager = { isQuestCompleted: vi.fn().mockReturnValue(true) }

    const original = [{ text: 'A' }, { text: 'B' }]
    const expanded = scene.expandCareerPathsChoices(original)

    expect(expanded).toEqual(original)
  })
})
