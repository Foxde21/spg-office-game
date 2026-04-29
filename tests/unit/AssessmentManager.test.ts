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
    state.careerPathProgress.currentLevel = 'ai-architect'

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

  it('requires minDomainsAttempted to level up (ai-junior -> ai-middle)', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'ai-junior'
    state.careerPathProgress.domainProgress['ml-fundamentals'].score = 80
    state.careerPathProgress.domainProgress['ml-fundamentals'].answeredQuestions = ['q1']
    state.careerPathProgress.domainProgress['data-engineering'].score = 80
    state.careerPathProgress.domainProgress['data-engineering'].answeredQuestions = ['q2']
    manager.loadState(state)

    expect(manager.canLevelUp()).toBe(true)
    expect(manager.promote()).toBe(true)
    expect(manager.getCurrentLevel().id).toBe('ai-middle')
  })

  it('promote advances only one level even when higher levels are eligible', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'ai-middle'
    const attempted = ['ml-fundamentals', 'data-engineering', 'deep-learning', 'nlp-llms', 'mlops', 'system-design']
    for (const domainId of attempted) {
      state.careerPathProgress.domainProgress[domainId].score = 95
      state.careerPathProgress.domainProgress[domainId].answeredQuestions = [`${domainId}-q`]
    }
    manager.loadState(state)

    expect(manager.canLevelUp()).toBe(true)
    expect(manager.promote()).toBe(true)
    expect(manager.getCurrentLevel().id).toBe('ai-senior')
  })

  it('rebuilds question pool after promotion so new level questions become available', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const s1 = manager.startAssessmentSession('ml-fundamentals', 6)
    expect(s1.questions.length).toBe(3)

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'ai-junior'
    state.careerPathProgress.domainProgress['ml-fundamentals'].score = 80
    state.careerPathProgress.domainProgress['ml-fundamentals'].answeredQuestions = ['q1']
    state.careerPathProgress.domainProgress['data-engineering'].score = 80
    state.careerPathProgress.domainProgress['data-engineering'].answeredQuestions = ['q2']
    manager.loadState(state)

    expect(manager.promote()).toBe(true)

    const s2 = manager.startAssessmentSession('ml-fundamentals', 6)
    expect(s2.questions.length).toBeGreaterThan(3)
  })

  it('resetDomainProgress clears answered questions and score', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    state.careerPathProgress.domainProgress['ml-fundamentals'].score = 55
    state.careerPathProgress.domainProgress['ml-fundamentals'].answeredQuestions = ['q1']
    manager.loadState(state)

    expect(manager.resetDomainProgress('ml-fundamentals')).toBe(true)
    expect(manager.getDomainProgress('ml-fundamentals').score).toBe(0)
    expect(manager.getAssessmentState().careerPathProgress.domainProgress['ml-fundamentals'].answeredQuestions).toEqual([])
  })

  it('getLevelUpBlockers reports domains below min score and attempted domains requirement', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'ai-middle'
    state.careerPathProgress.domainProgress['ml-fundamentals'].score = 95
    state.careerPathProgress.domainProgress['ml-fundamentals'].answeredQuestions = ['q1']
    state.careerPathProgress.domainProgress['data-engineering'].score = 20
    state.careerPathProgress.domainProgress['data-engineering'].answeredQuestions = ['q2']
    manager.loadState(state)

    const blockers = manager.getLevelUpBlockers()
    expect(blockers).toBeTruthy()
    expect(blockers.nextLevelTitle).toBeTruthy()
    expect(blockers.requiredAttemptedDomains).toBeGreaterThan(1)
    expect(blockers.domainsBelowMin.length).toBeGreaterThan(0)
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

  it('does not use next-level topic questions before promote (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock-levels') return undefined
          return {
            id: 'mock-levels',
            name: 'Mock Levels',
            description: 'Mock',
            icon: 'mock',
            levels: [
              { id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 },
              { id: 'l2', title: 'L2', minAvgScore: 50, minDomainScore: 0, minDomainsAttempted: 1 }
            ],
            domains: [
              {
                id: 'd1',
                name: 'D1',
                description: 'D1',
                icon: 'd1',
                careerPathId: 'mock-levels',
                topics: [
                  {
                    id: 't1',
                    name: 'T1',
                    level: 'l1',
                    questions: [
                      {
                        id: 'q-l1',
                        scenario: 's',
                        question: 'q',
                        choices: [
                          { id: 'a', text: 'a', score: 0, feedback: 'f', competencyTags: [] },
                          { id: 'b', text: 'b', score: 100, feedback: 'f', competencyTags: [] }
                        ],
                        explanation: 'e',
                        domainId: 'd1',
                        difficulty: 1
                      }
                    ]
                  },
                  {
                    id: 't2',
                    name: 'T2',
                    level: 'l2',
                    questions: [
                      {
                        id: 'q-l2',
                        scenario: 's',
                        question: 'q',
                        choices: [
                          { id: 'a', text: 'a', score: 0, feedback: 'f', competencyTags: [] },
                          { id: 'b', text: 'b', score: 100, feedback: 'f', competencyTags: [] }
                        ],
                        explanation: 'e',
                        domainId: 'd1',
                        difficulty: 4
                      }
                    ]
                  }
                ]
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
    manager.setCareerPath('mock-levels')

    const q1 = manager.getNextQuestion('d1')
    expect(q1).toBeTruthy()
    expect(q1.id).toBe('q-l1')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'l2'
    state.careerPathProgress.domainProgress.d1.score = 90
    state.careerPathProgress.domainProgress.d1.answeredQuestions = ['q-l1']
    manager.loadState(state)

    const q2 = manager.getNextQuestion('d1')
    expect(q2).toBeTruthy()
    expect(q2.id).toBe('q-l2')

    vi.doUnmock('../../src/data/careerPaths')
  })

  it('falls back to any unanswered question when difficulty filter yields no candidates (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock-fallback') return undefined
          return {
            id: 'mock-fallback',
            name: 'Mock Fallback',
            description: 'Mock',
            icon: 'mock',
            levels: [{ id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 }],
            domains: [
              {
                id: 'd1',
                name: 'D1',
                description: 'D1',
                icon: 'd1',
                careerPathId: 'mock-fallback',
                topics: [
                  {
                    id: 't1',
                    name: 'T1',
                    level: 'l1',
                    questions: [
                      {
                        id: 'q-only-hard',
                        scenario: 's',
                        question: 'q',
                        choices: [
                          { id: 'a', text: 'a', score: 0, feedback: 'f', competencyTags: [] },
                          { id: 'b', text: 'b', score: 100, feedback: 'f', competencyTags: [] }
                        ],
                        explanation: 'e',
                        domainId: 'd1',
                        difficulty: 4
                      }
                    ]
                  }
                ]
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
    manager.setCareerPath('mock-fallback')

    const q = manager.getNextQuestion('d1')
    expect(q).toBeTruthy()
    expect(q.id).toBe('q-only-hard')

    vi.doUnmock('../../src/data/careerPaths')
  })

  it('getLevelUpBlockers is scenario-accurate for avg and attempted domains constraints (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock-blockers') return undefined
          return {
            id: 'mock-blockers',
            name: 'Mock Blockers',
            description: 'Mock',
            icon: 'mock',
            levels: [
              { id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 },
              { id: 'l2', title: 'L2', minAvgScore: 70, minDomainScore: 50, minDomainsAttempted: 2 }
            ],
            domains: [
              { id: 'a', name: 'A', description: 'A', icon: 'a', careerPathId: 'mock-blockers', topics: [] },
              { id: 'b', name: 'B', description: 'B', icon: 'b', careerPathId: 'mock-blockers', topics: [] }
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
    manager.setCareerPath('mock-blockers')

    let state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'l1'
    state.careerPathProgress.domainProgress.a.score = 60
    state.careerPathProgress.domainProgress.a.answeredQuestions = ['q1']
    manager.loadState(state)

    let blockers = manager.getLevelUpBlockers()
    expect(blockers).toBeTruthy()
    expect(blockers.attemptedBelowMin).toBe(true)

    state = manager.getAssessmentState()
    state.careerPathProgress.domainProgress.b.score = 10
    state.careerPathProgress.domainProgress.b.answeredQuestions = ['q2']
    manager.loadState(state)

    blockers = manager.getLevelUpBlockers()
    expect(blockers).toBeTruthy()
    expect(blockers.attemptedBelowMin).toBe(false)
    expect(blockers.avgBelowMin).toBe(true)
    expect(blockers.domainsBelowMin.length).toBeGreaterThan(0)

    vi.doUnmock('../../src/data/careerPaths')
  })

  it('canLevelUp is false when average score is below next level threshold (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock-avg') return undefined
          return {
            id: 'mock-avg',
            name: 'Mock Avg',
            description: 'Mock',
            icon: 'mock',
            levels: [
              { id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 },
              { id: 'l2', title: 'L2', minAvgScore: 70, minDomainScore: 0, minDomainsAttempted: 1 }
            ],
            domains: [
              { id: 'a', name: 'A', description: 'A', icon: 'a', careerPathId: 'mock-avg', topics: [] }
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
    manager.setCareerPath('mock-avg')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'l1'
    state.careerPathProgress.domainProgress.a.score = 10
    state.careerPathProgress.domainProgress.a.answeredQuestions = ['q1']
    manager.loadState(state)

    expect(manager.canLevelUp()).toBe(false)
    expect(manager.promote()).toBe(false)
    expect(manager.getCurrentLevel().id).toBe('l1')

    const blockers = manager.getLevelUpBlockers()
    expect(blockers).toBeTruthy()
    expect(blockers.avgBelowMin).toBe(true)

    vi.doUnmock('../../src/data/careerPaths')
  })

  it('canLevelUp is false when not all attempted domains meet minDomainScore (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock-min-domain') return undefined
          return {
            id: 'mock-min-domain',
            name: 'Mock Min Domain',
            description: 'Mock',
            icon: 'mock',
            levels: [
              { id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 },
              { id: 'l2', title: 'L2', minAvgScore: 0, minDomainScore: 50, minDomainsAttempted: 2 }
            ],
            domains: [
              { id: 'a', name: 'A', description: 'A', icon: 'a', careerPathId: 'mock-min-domain', topics: [] },
              { id: 'b', name: 'B', description: 'B', icon: 'b', careerPathId: 'mock-min-domain', topics: [] }
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
    manager.setCareerPath('mock-min-domain')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'l1'
    state.careerPathProgress.domainProgress.a.score = 100
    state.careerPathProgress.domainProgress.a.answeredQuestions = ['qa']
    state.careerPathProgress.domainProgress.b.score = 40
    state.careerPathProgress.domainProgress.b.answeredQuestions = ['qb']
    manager.loadState(state)

    expect(manager.canLevelUp()).toBe(false)

    const blockers = manager.getLevelUpBlockers()
    expect(blockers).toBeTruthy()
    expect(blockers.domainsBelowMin.map((d: any) => d.domainId)).toContain('b')

    vi.doUnmock('../../src/data/careerPaths')
  })

  it('getLevelUpBlockers returns null at max level', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'ai-architect'
    manager.loadState(state)

    expect(manager.getLevelUpBlockers()).toBeNull()
  })

  it('resetDomainProgress makes previously answered question available again', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const rnd = vi.spyOn(Math, 'random').mockReturnValue(0)

    const q1 = manager.getNextQuestion('ml-fundamentals')
    expect(q1).toBeTruthy()
    const bestChoice = q1.choices.reduce((best: any, c: any) => (c.score > best.score ? c : best), q1.choices[0])
    manager.submitAnswer(q1.id, bestChoice.id)

    expect(manager.getNextQuestion('ml-fundamentals')?.id).not.toBe(q1.id)

    manager.resetDomainProgress('ml-fundamentals')

    const qAgain = manager.getNextQuestion('ml-fundamentals')
    expect(qAgain).toBeTruthy()
    expect(qAgain.id).toBe(q1.id)

    rnd.mockRestore()
  })

  it('submitAnswer updates domain score with deterministic smoothing (0.6/0.4)', async () => {
    vi.resetModules()
    const mockGame = createMockGame()
    const mod = await import('../../src/managers/Assessment')
    const AssessmentManager = mod.AssessmentManager as any
    AssessmentManager.instance = undefined

    const manager = AssessmentManager.getInstance(mockGame as any)
    manager.setCareerPath('ai')

    const q = manager.getNextQuestion('ml-fundamentals')
    const bestChoice = q.choices.reduce(
      (best: any, c: any) => (c.score > best.score ? c : best),
      q.choices[0]
    )
    const r1 = manager.submitAnswer(q.id, bestChoice.id)
    const expected1 = 0 * 0.6 + bestChoice.score * 0.4

    expect(Math.round(r1.newDomainScore)).toBe(Math.round(expected1))

    const q2 = manager.getNextQuestion('ml-fundamentals')
    const bestChoice2 = q2.choices.reduce(
      (best: any, c: any) => (c.score > best.score ? c : best),
      q2.choices[0]
    )
    const r2 = manager.submitAnswer(q2.id, bestChoice2.id)
    const expected2 = expected1 * 0.6 + bestChoice2.score * 0.4

    expect(Math.round(r2.newDomainScore)).toBe(Math.round(expected2))
  })

  it('topic gating falls back to first level when currentLevel is unknown (mock career path)', async () => {
    vi.resetModules()

    vi.doMock('../../src/data/careerPaths', () => {
      return {
        getCareerPath: (id: string) => {
          if (id !== 'mock-unknown-level') return undefined
          return {
            id: 'mock-unknown-level',
            name: 'Mock Unknown',
            description: 'Mock',
            icon: 'mock',
            levels: [
              { id: 'l1', title: 'L1', minAvgScore: 0, minDomainScore: 0 },
              { id: 'l2', title: 'L2', minAvgScore: 0, minDomainScore: 0 }
            ],
            domains: [
              {
                id: 'd1',
                name: 'D1',
                description: 'D1',
                icon: 'd1',
                careerPathId: 'mock-unknown-level',
                topics: [
                  {
                    id: 't1',
                    name: 'T1',
                    level: 'l1',
                    questions: [
                      {
                        id: 'q-l1',
                        scenario: 's',
                        question: 'q',
                        choices: [
                          { id: 'a', text: 'a', score: 0, feedback: 'f', competencyTags: [] },
                          { id: 'b', text: 'b', score: 100, feedback: 'f', competencyTags: [] }
                        ],
                        explanation: 'e',
                        domainId: 'd1',
                        difficulty: 1
                      }
                    ]
                  },
                  {
                    id: 't2',
                    name: 'T2',
                    level: 'l2',
                    questions: [
                      {
                        id: 'q-l2',
                        scenario: 's',
                        question: 'q',
                        choices: [
                          { id: 'a', text: 'a', score: 0, feedback: 'f', competencyTags: [] },
                          { id: 'b', text: 'b', score: 100, feedback: 'f', competencyTags: [] }
                        ],
                        explanation: 'e',
                        domainId: 'd1',
                        difficulty: 1
                      }
                    ]
                  }
                ]
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
    manager.setCareerPath('mock-unknown-level')

    const state = manager.getAssessmentState()
    state.careerPathProgress.currentLevel = 'does-not-exist'
    manager.loadState(state)

    const q = manager.getNextQuestion('d1')
    expect(q).toBeTruthy()
    expect(q.id).toBe('q-l1')

    vi.doUnmock('../../src/data/careerPaths')
  })
})
