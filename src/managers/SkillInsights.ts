import Phaser from 'phaser'

import { getSkillMatrixForNpc } from '../data/skillMatrices'

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value))
}

type SkillLevelId = 'junior' | 'middle' | 'senior' | 'expert'

interface AssessmentAnsweredEvent {
  careerPathId: string
  questionId: string
  choiceId: string
  score: number
  domainId: string
  assessorNpcId?: string
  competencyTags?: string[]
}

export interface SkillInsight {
  npcId: string
  matrixId: string
  tag: string
  title: string
  score: number
  level: SkillLevelId
  nextLevel?: SkillLevelId
  currentExpectation: string
  nextExpectation?: string
}

export class SkillInsightsManager {
  private static instance: SkillInsightsManager
  private game: Phaser.Game
  private tagScores: Map<string, number> = new Map()
  private tagCounts: Map<string, number> = new Map()

  private constructor(game: Phaser.Game) {
    this.game = game
    this.game.events.on('assessmentAnswered', this.onAssessmentAnswered, this)
  }

  static getInstance(game?: Phaser.Game): SkillInsightsManager {
    if (!SkillInsightsManager.instance && game) {
      SkillInsightsManager.instance = new SkillInsightsManager(game)
    }

    return SkillInsightsManager.instance
  }

  getTagScore(tag: string): number {
    return this.tagScores.get(tag) ?? 0
  }

  getTagCount(tag: string): number {
    return this.tagCounts.get(tag) ?? 0
  }

  clear(): void {
    this.tagScores.clear()
    this.tagCounts.clear()
  }

  private onAssessmentAnswered(payload: unknown): void {
    const e = payload as AssessmentAnsweredEvent
    if (!e.assessorNpcId) return

    const matrix = getSkillMatrixForNpc(e.assessorNpcId)
    if (!matrix) return

    const tags = e.competencyTags ?? []
    if (tags.length === 0) return

    for (const tag of tags) {
      if (!matrix.items[tag]) continue

      const oldScore = this.tagScores.get(tag) ?? 0
      const newScore = clampScore(oldScore * 0.8 + clampScore(e.score) * 0.2)
      this.tagScores.set(tag, newScore)

      const oldCount = this.tagCounts.get(tag) ?? 0
      this.tagCounts.set(tag, oldCount + 1)
    }

    const insight = this.buildInsight(e.assessorNpcId, matrix.id)
    if (!insight) return

    this.game.events.emit('skillInsight', insight)
  }

  private buildInsight(npcId: string, matrixId: string): SkillInsight | null {
    const matrix = getSkillMatrixForNpc(npcId)
    if (!matrix) return null

    const scored = Object.keys(matrix.items)
      .map((tag) => ({ tag, score: this.tagScores.get(tag), count: this.tagCounts.get(tag) }))
      .filter((x) => (x.count ?? 0) > 0 && x.score !== undefined) as Array<{
      tag: string
      score: number
      count: number
    }>

    if (scored.length === 0) return null

    scored.sort((a, b) => a.score - b.score)
    const weakest = scored[0]

    const item = matrix.items[weakest.tag]
    const level = this.getLevelId(weakest.score)
    const nextLevel = this.getNextLevelId(level)

    return {
      npcId,
      matrixId,
      tag: weakest.tag,
      title: item.title,
      score: weakest.score,
      level,
      nextLevel,
      currentExpectation: item.expectations[level],
      nextExpectation: nextLevel ? item.expectations[nextLevel] : undefined
    }
  }

  private getLevelId(score: number): SkillLevelId {
    if (score < 50) return 'junior'
    if (score < 70) return 'middle'
    if (score < 85) return 'senior'
    return 'expert'
  }

  private getNextLevelId(level: SkillLevelId): SkillLevelId | undefined {
    if (level === 'junior') return 'middle'
    if (level === 'middle') return 'senior'
    if (level === 'senior') return 'expert'

    return undefined
  }
}
