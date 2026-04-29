import Phaser from 'phaser'

import { getSkillMatrixForNpc } from '../data/skillMatrices'
import type { SkillMatrix, SkillMatrixLevelId } from '../data/skillMatrices/softwareDev'

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value))
}

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
  level: SkillMatrixLevelId
  nextLevel?: SkillMatrixLevelId
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

  private getKey(matrixId: string, tag: string): string {
    return `${matrixId}:${tag}`
  }

  getTagScore(matrixId: string, tag: string): number {
    return this.tagScores.get(this.getKey(matrixId, tag)) ?? 0
  }

  getTagCount(matrixId: string, tag: string): number {
    return this.tagCounts.get(this.getKey(matrixId, tag)) ?? 0
  }

  getWeakestTagsForNpc(
    npcId: string,
    count = 3
  ): Array<{ matrixId: string; tag: string; title: string; score: number }> {
    const matrix = getSkillMatrixForNpc(npcId)
    if (!matrix) return []

    const scored = Object.keys(matrix.items)
      .map((tag) => {
        const key = this.getKey(matrix.id, tag)

        return {
          tag,
          title: matrix.items[tag].title,
          score: this.tagScores.get(key) ?? 0,
          count: this.tagCounts.get(key) ?? 0
        }
      })
      .filter((x) => x.count > 0)

    scored.sort((a, b) => a.score - b.score)

    return scored.slice(0, Math.max(1, Math.min(count, scored.length))).map((x) => ({
      matrixId: matrix.id,
      tag: x.tag,
      title: x.title,
      score: x.score
    }))
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

      const key = this.getKey(matrix.id, tag)

      const oldScore = this.tagScores.get(key) ?? 0
      const newScore = clampScore(oldScore * 0.8 + clampScore(e.score) * 0.2)
      this.tagScores.set(key, newScore)

      const oldCount = this.tagCounts.get(key) ?? 0
      this.tagCounts.set(key, oldCount + 1)
    }

    const insight = this.buildInsight(e.assessorNpcId, matrix)
    if (!insight) return

    this.game.events.emit('skillInsight', insight)
  }

  private buildInsight(npcId: string, matrix: SkillMatrix): SkillInsight | null {
    const scored = Object.keys(matrix.items)
      .map((tag) => {
        const key = this.getKey(matrix.id, tag)

        return { tag, score: this.tagScores.get(key), count: this.tagCounts.get(key) }
      })
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
      matrixId: matrix.id,
      tag: weakest.tag,
      title: item.title,
      score: weakest.score,
      level,
      nextLevel,
      currentExpectation: item.expectations[level],
      nextExpectation: nextLevel ? item.expectations[nextLevel] : undefined
    }
  }

  private getLevelId(score: number): SkillMatrixLevelId {
    if (score < 50) return 'junior'
    if (score < 70) return 'middle'
    if (score < 85) return 'senior'
    return 'expert'
  }

  private getNextLevelId(level: SkillMatrixLevelId): SkillMatrixLevelId | undefined {
    if (level === 'junior') return 'middle'
    if (level === 'middle') return 'senior'
    if (level === 'senior') return 'expert'

    return undefined
  }
}
