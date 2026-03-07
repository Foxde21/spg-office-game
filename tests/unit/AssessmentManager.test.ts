import { beforeEach, describe, expect, it, vi } from 'vitest'

const createMockGame = () => ({
  events: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
})

describe('AssessmentManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('creates singleton instance', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const m1 = AssessmentManager.getInstance(mockGame as any)
    const m2 = AssessmentManager.getInstance(mockGame as any)

    expect(m1).toBeTruthy()
    expect(m2).toBe(m1)
  })

  it('setCareerPath initializes progress for all domains', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    expect(state.chosenCareerPathId).toBe('ai')
    expect(state.careerPathProgress).toBeDefined()
    expect(Object.keys(state.careerPathProgress.domainProgress)).toHaveLength(8)
  })

  it('getNextQuestion returns only difficulty 1 question when domain score is low', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const q = manager.getNextQuestion('ml-fundamentals')
    expect(q).toBeTruthy()
    expect(q.difficulty).toBe(1)
  })

  it('getNextQuestion does not repeat answered questions', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const q1 = manager.getNextQuestion('ml-fundamentals')
    expect(q1).toBeTruthy()

    const bestChoice = q1.choices.reduce((best: any, c: any) => (c.score > best.score ? c : best), q1.choices[0])
    manager.submitAnswer(q1.id, bestChoice.id)

    const q2 = manager.getNextQuestion('ml-fundamentals')
    expect(q2).toBeTruthy()
    expect(q2.id).not.toBe(q1.id)
  })

  it('getNextQuestion returns null when suitable questions are exhausted', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    for (let i = 0; i < 3; i++) {
      const q = manager.getNextQuestion('ml-fundamentals')
      expect(q).toBeTruthy()
      const worstChoice = q.choices.reduce((worst: any, c: any) => (c.score < worst.score ? c : worst), q.choices[0])
      manager.submitAnswer(q.id, worstChoice.id)
    }

    const next = manager.getNextQuestion('ml-fundamentals')
    expect(next).toBeNull()
  })

  it('startAssessmentSession creates a session with 3-5 questions and emits event', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const session = manager.startAssessmentSession('ml-fundamentals', 3)
    expect(session.careerPathId).toBe('ai')
    expect(session.domainId).toBe('ml-fundamentals')
    expect(session.questions).toHaveLength(3)

    const ids = session.questions.map((q: any) => q.id)
    expect(new Set(ids).size).toBe(ids.length)

    expect(mockGame.events.emit).toHaveBeenCalledWith(
      'assessmentSessionStarted',
      expect.objectContaining({ careerPathId: 'ai', domainId: 'ml-fundamentals', count: 3 })
    )
  })

  it('submitAnswer updates domain score and affects stress/respect', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const gameStateMod = await import('../../src/managers/GameState')
    const GameStateManager = gameStateMod.GameStateManager as any
    GameStateManager.instance = undefined

    const assessmentMod = await import('../../src/managers/Assessment')
    const AssessmentManager = assessmentMod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const gameState = GameStateManager.getInstance(mockGame as any)
    expect(gameState.getStress()).toBe(0)
    expect(gameState.getRespect()).toBe(0)

    const q = manager.getNextQuestion('ml-fundamentals')
    expect(q).toBeTruthy()

    const bestChoice = q.choices.reduce((best: any, c: any) => (c.score > best.score ? c : best), q.choices[0])
    const result = manager.submitAnswer(q.id, bestChoice.id)

    expect(result.newDomainScore).toBeGreaterThanOrEqual(0)
    expect(mockGame.events.emit).toHaveBeenCalledWith('assessmentAnswered', expect.any(Object))

    expect(gameState.getStress()).toBeLessThanOrEqual(0)
    expect(gameState.getRespect()).toBeGreaterThanOrEqual(0)
  })

  it('getCurrentLevel is calculated from levels (generic)', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    for (const domainId of Object.keys(state.careerPathProgress.domainProgress)) {
      state.careerPathProgress.domainProgress[domainId].score = 90
    }

    manager.loadState(state)

    const level = manager.getCurrentLevel()
    expect(level).toBeTruthy()
    expect(level.id).toBe('ai-architect')
  })

  it('getAvailableDomains respects unlockCondition (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock') return undefined
          return {
            id: 'mock',
            name: 'Mock Path',
            description: 'Mock',
            icon: 'mock',
            levels: [{ id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 }],
            domains: [
              {
                id: 'a',
                name: 'A',
                description: 'A',
                icon: 'a',
                careerPathId: 'mock',
                topics: []
              },
              {
                id: 'b',
                name: 'B',
                description: 'B',
                icon: 'b',
                careerPathId: 'mock',
                topics: [],
                unlockCondition: { minScoreInAnyDomain: 50 }
              }
            ],
            npcAssessors: []
          }
        }
      }
    })

    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('mock')

    let available = manager.getAvailableDomains().map((d: any) => d.id)
    expect(available).toEqual(['a'])

    const state = manager.getAssessmentState()
    state.careerPathProgress.domainProgress.a.score = 60
    manager.loadState(state)

    available = manager.getAvailableDomains().map((d: any) => d.id)
    expect(available).toEqual(['a', 'b'])

    vi.doUnmock('../../src/data/careerPaths')
  })

  it('getAssessmentState/loadState restores answered questions', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const q1 = manager.getNextQuestion('ml-fundamentals')
    const bestChoice = q1.choices.reduce((best: any, c: any) => (c.score > best.score ? c : best), q1.choices[0])
    manager.submitAnswer(q1.id, bestChoice.id)

    const saved = manager.getAssessmentState()

    vi.resetModules()
    const mod2 = await import('../../src/managers/Assessment')
    const AssessmentManager2 = mod2.AssessmentManager as any
    AssessmentManager2.instance = undefined

    const manager2 = AssessmentManager2.getInstance(mockGame as any)
    manager2.loadState(saved)

    const q2 = manager2.getNextQuestion('ml-fundamentals')
    expect(q2).toBeTruthy()
    expect(q2.id).not.toBe(q1.id)
  })

  it('reset clears chosen career path and progress', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const before = manager.getAssessmentState()
    expect(before.chosenCareerPathId).toBe('ai')
    expect(before.careerPathProgress).toBeDefined()

    manager.reset()

    const after = manager.getAssessmentState()
    expect(after.chosenCareerPathId).toBeUndefined()
    expect(after.careerPathProgress).toBeUndefined()
    expect(manager.getCareerPath()).toBeNull()
  })
})
