import { describe, it, expect } from 'vitest'
import { getCareerPath, getAllCareerPaths } from '../../src/data/careerPaths'
import { AI_CAREER_PATH } from '../../src/data/careerPaths/ai'

describe('Career Paths registry', () => {
  describe('getAllCareerPaths', () => {
    it('returns non-empty array', () => {
      const paths = getAllCareerPaths()
      expect(Array.isArray(paths)).toBe(true)
      expect(paths.length).toBeGreaterThan(0)
    })

    it('returns only valid CareerPath objects with required fields', () => {
      const paths = getAllCareerPaths()
      for (const p of paths) {
        expect(p).toHaveProperty('id')
        expect(p).toHaveProperty('name')
        expect(p).toHaveProperty('description')
        expect(p).toHaveProperty('icon')
        expect(p).toHaveProperty('levels')
        expect(p).toHaveProperty('domains')
        expect(p).toHaveProperty('npcAssessors')
        expect(Array.isArray(p.levels)).toBe(true)
        expect(Array.isArray(p.domains)).toBe(true)
        expect(Array.isArray(p.npcAssessors)).toBe(true)
      }
    })
  })

  describe('getCareerPath', () => {
    it('returns AI path for id "ai"', () => {
      const path = getCareerPath('ai')
      expect(path).toBeDefined()
      expect(path!.id).toBe('ai')
      expect(path!.name).toBe('AI & Machine Learning')
    })

    it('returns undefined for unknown id', () => {
      expect(getCareerPath('unknown')).toBeUndefined()
    })

    it('returned path is same reference as in getAllCareerPaths', () => {
      const byId = getCareerPath('ai')
      const all = getAllCareerPaths()
      expect(all.find(p => p.id === 'ai')).toBe(byId)
    })
  })
})

describe('AI_CAREER_PATH', () => {
  it('has exactly 4 levels', () => {
    expect(AI_CAREER_PATH.levels).toHaveLength(4)
  })

  it('level ids are ai-junior, ai-middle, ai-senior, ai-architect', () => {
    const ids = AI_CAREER_PATH.levels.map(l => l.id)
    expect(ids).toEqual(['ai-junior', 'ai-middle', 'ai-senior', 'ai-architect'])
  })

  it('each level has id, title, minAvgScore, minDomainScore', () => {
    for (const level of AI_CAREER_PATH.levels) {
      expect(level).toHaveProperty('id')
      expect(level).toHaveProperty('title')
      expect(typeof level.minAvgScore).toBe('number')
      expect(typeof level.minDomainScore).toBe('number')
    }
  })

  it('has exactly 8 domains', () => {
    expect(AI_CAREER_PATH.domains).toHaveLength(8)
  })

  it('has ml-fundamentals domain with 12 questions (3 per level)', () => {
    const ml = AI_CAREER_PATH.domains.find(d => d.id === 'ml-fundamentals')
    expect(ml).toBeDefined()
    expect(ml!.topics).toHaveLength(4)
    const totalQuestions = ml!.topics.reduce((sum, t) => sum + t.questions.length, 0)
    expect(totalQuestions).toBe(12)
    for (const topic of ml!.topics) {
      expect(topic.questions).toHaveLength(3)
    }
  })

  it('each ML question has scenario, question, choices, explanation, domainId, difficulty', () => {
    const ml = AI_CAREER_PATH.domains.find(d => d.id === 'ml-fundamentals')!
    for (const topic of ml.topics) {
      for (const q of topic.questions) {
        expect(q).toHaveProperty('id')
        expect(typeof q.scenario).toBe('string')
        expect(q.scenario.length).toBeGreaterThan(0)
        expect(typeof q.question).toBe('string')
        expect(q.question.length).toBeGreaterThan(0)
        expect(Array.isArray(q.choices)).toBe(true)
        expect(q.choices.length).toBeGreaterThan(0)
        expect(typeof q.explanation).toBe('string')
        expect(q.domainId).toBe('ml-fundamentals')
        expect([1, 2, 3, 4]).toContain(q.difficulty)
      }
    }
  })

  it('each choice has score 0-100, feedback, competencyTags', () => {
    const ml = AI_CAREER_PATH.domains.find(d => d.id === 'ml-fundamentals')!
    for (const topic of ml.topics) {
      for (const q of topic.questions) {
        for (const choice of q.choices) {
          expect(choice).toHaveProperty('id')
          expect(typeof choice.text).toBe('string')
          expect(typeof choice.score).toBe('number')
          expect(choice.score).toBeGreaterThanOrEqual(0)
          expect(choice.score).toBeLessThanOrEqual(100)
          expect(typeof choice.feedback).toBe('string')
          expect(Array.isArray(choice.competencyTags)).toBe(true)
        }
      }
    }
  })

  it('has 4 npcAssessors including petya-senior, masha-qa, olga-product, professor-neuronov', () => {
    expect(AI_CAREER_PATH.npcAssessors).toHaveLength(4)
    const npcIds = AI_CAREER_PATH.npcAssessors.map(a => a.npcId)
    expect(npcIds).toContain('petya-senior')
    expect(npcIds).toContain('masha-qa')
    expect(npcIds).toContain('olga-product')
    expect(npcIds).toContain('professor-neuronov')
  })

  it('stub domains have empty topics', () => {
    const stubIds = ['data-engineering', 'deep-learning', 'nlp-llms', 'computer-vision', 'mlops', 'system-design', 'ai-ethics']
    for (const id of stubIds) {
      const domain = AI_CAREER_PATH.domains.find(d => d.id === id)
      expect(domain).toBeDefined()
      expect(domain!.topics).toEqual([])
    }
  })
})
