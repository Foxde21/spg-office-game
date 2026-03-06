import { beforeEach, describe, expect, it, vi } from 'vitest'

const createMockGame = () => {
  const listeners = new Map<string, Array<{ cb: (payload: unknown) => void; ctx?: unknown }>>()

  const on = vi.fn((event: string, cb: (payload: unknown) => void, ctx?: unknown) => {
    const existing = listeners.get(event) ?? []
    existing.push({ cb, ctx })
    listeners.set(event, existing)
  })

  const off = vi.fn((event: string, cb: (payload: unknown) => void, ctx?: unknown) => {
    const existing = listeners.get(event) ?? []
    listeners.set(
      event,
      existing.filter((l) => l.cb !== cb || l.ctx !== ctx)
    )
  })

  const emit = vi.fn((event: string, payload: unknown) => {
    const existing = listeners.get(event) ?? []
    for (const l of existing) {
      l.cb.call(l.ctx, payload)
    }
  })

  return {
    events: {
      emit,
      on,
      off
    }
  }
}

describe('SkillInsightsManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('updates tag scores on assessmentAnswered and emits skillInsight for petya-senior', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    const manager = SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 20,
      domainId: 'ml-fundamentals',
      assessorNpcId: 'petya-senior',
      competencyTags: ['documentation']
    })

    expect(manager.getTagCount('software-dev', 'documentation')).toBe(1)
    expect(manager.getTagScore('software-dev', 'documentation')).toBeCloseTo(4)

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(1)
    const payload = skillInsightCalls[0][1]
    expect(payload.npcId).toBe('petya-senior')
    expect(payload.matrixId).toBe('software-dev')
    expect(payload.tag).toBe('documentation')
    expect(payload.level).toBe('junior')
    expect(payload.nextLevel).toBe('middle')
    expect(typeof payload.currentExpectation).toBe('string')
  })

  it('emits QA matrix insights for masha-qa', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 40,
      domainId: 'ml-fundamentals',
      assessorNpcId: 'masha-qa',
      competencyTags: ['qa.process']
    })

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(1)
    const payload = skillInsightCalls[0][1]
    expect(payload.npcId).toBe('masha-qa')
    expect(payload.matrixId).toBe('qa')
    expect(payload.tag).toBe('qa.process')
  })

  it('emits BA matrix insights for igor-analyst', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 60,
      domainId: 'ml-fundamentals',
      assessorNpcId: 'igor-analyst',
      competencyTags: ['ba.documentation']
    })

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(1)
    const payload = skillInsightCalls[0][1]
    expect(payload.npcId).toBe('igor-analyst')
    expect(payload.matrixId).toBe('ba')
    expect(payload.tag).toBe('ba.documentation')
  })

  it('emits Product matrix insights for olga-product', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 50,
      domainId: 'ml-fundamentals',
      assessorNpcId: 'olga-product',
      competencyTags: ['product.prioritization']
    })

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(1)
    const payload = skillInsightCalls[0][1]
    expect(payload.npcId).toBe('olga-product')
    expect(payload.matrixId).toBe('product')
    expect(payload.tag).toBe('product.prioritization')
  })

  it('emits Design matrix insights for lesha-designer', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 55,
      domainId: 'ml-fundamentals',
      assessorNpcId: 'lesha-designer',
      competencyTags: ['design.ui']
    })

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(1)
    const payload = skillInsightCalls[0][1]
    expect(payload.npcId).toBe('lesha-designer')
    expect(payload.matrixId).toBe('design')
    expect(payload.tag).toBe('design.ui')
  })

  it('does not emit insights when assessorNpcId is missing', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 20,
      domainId: 'ml-fundamentals',
      competencyTags: ['documentation']
    })

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(0)
  })

  it('ignores competency tags that are not present in the matrix', async () => {
    vi.resetModules()
    const mockGame = createMockGame()

    const mod = await import('../../src/managers/SkillInsights')
    const SkillInsightsManager = mod.SkillInsightsManager as any
    SkillInsightsManager.instance = undefined

    const manager = SkillInsightsManager.getInstance(mockGame as any)

    mockGame.events.emit('assessmentAnswered', {
      careerPathId: 'ai',
      questionId: 'q1',
      choiceId: 'a',
      score: 100,
      domainId: 'ml-fundamentals',
      assessorNpcId: 'petya-senior',
      competencyTags: ['unknown-tag']
    })

    expect(manager.getTagCount('software-dev', 'unknown-tag')).toBe(0)

    const skillInsightCalls = (mockGame.events.emit as any).mock.calls.filter(
      (c: any[]) => c[0] === 'skillInsight'
    )

    expect(skillInsightCalls.length).toBe(0)
  })
})
