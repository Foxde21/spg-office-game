import Phaser from 'phaser'

import { ASSESSMENT_SCORING } from '../config'
import { getCareerPath } from '../data/careerPaths'
import type {
  AssessmentQuestion,
  AssessmentSession,
  AssessmentState,
  CareerPath,
  CareerPathLevel,
  CompetencyDomain,
  DomainProgress,
  SessionAnswer,
  SessionResult,
  SubmitAnswerResult
} from '../types/assessment'
import { GameStateManager } from './GameState'

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value))
}

function cloneAssessmentState(state: AssessmentState): AssessmentState {
  return JSON.parse(JSON.stringify(state)) as AssessmentState
}

function getAllowedDifficulties(domainScore: number): Array<1 | 2 | 3 | 4> {
  if (domainScore < 25) return [1]
  if (domainScore < 50) return [1, 2]
  if (domainScore < 70) return [2, 3]
  if (domainScore < 85) return [3, 4]
  return [4]
}

export class AssessmentManager {
  private static instance: AssessmentManager
  private game: Phaser.Game
  private careerPath: CareerPath | null = null
  private state: AssessmentState = {}
  private questionsByDomain: Map<string, AssessmentQuestion[]> = new Map()
  private questionsById: Map<string, AssessmentQuestion> = new Map()
  private answeredQuestionIds: Set<string> = new Set()
  private currentSession: AssessmentSession | null = null
  private sessionDomainScoreBefore: number | null = null

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): AssessmentManager {
    if (!AssessmentManager.instance && game) {
      AssessmentManager.instance = new AssessmentManager(game)
    }

    return AssessmentManager.instance
  }

  setCareerPath(careerPathId: string): void {
    const path = getCareerPath(careerPathId)
    if (!path) {
      this.reset()
      return
    }

    this.careerPath = path
    this.state.chosenCareerPathId = path.id

    const domainProgress: Record<string, DomainProgress> = {}
    for (const domain of path.domains) {
      domainProgress[domain.id] = {
        domainId: domain.id,
        score: 0,
        answeredQuestions: []
      }
    }

    const initialLevel = path.levels[0]?.id || 'level-1'

    this.state.careerPathProgress = {
      careerPathId: path.id,
      currentLevel: initialLevel,
      domainProgress,
      totalAssessments: 0,
      averageScore: 0
    }

    this.answeredQuestionIds = new Set()
    this.currentSession = null
    this.sessionDomainScoreBefore = null

    this.rebuildQuestionsIndex()
  }

  getCareerPath(): CareerPath | null {
    return this.careerPath
  }

  getCareerPathId(): string | undefined {
    return this.careerPath?.id
  }

  startAssessmentSession(
    domainId: string,
    count?: number,
    assessorNpcId?: string
  ): AssessmentSession {
    const careerPathId = this.careerPath?.id
    if (!careerPathId || !this.state.careerPathProgress) {
      throw new Error('Career path is not set')
    }

    const requested = count ?? 3
    const sessionCount = Math.max(3, Math.min(5, requested))

    const selectedIds: Set<string> = new Set()
    const questions: AssessmentQuestion[] = []
    for (let i = 0; i < sessionCount; i++) {
      const q = this.pickNextQuestion(domainId, selectedIds)
      if (!q) break

      questions.push(q)
      selectedIds.add(q.id)
    }

    const progress = this.state.careerPathProgress.domainProgress[domainId]
    this.sessionDomainScoreBefore = progress?.score ?? 0

    this.currentSession = {
      careerPathId,
      domainId,
      assessorNpcId,
      questions,
      currentIndex: 0,
      answers: [],
      startedAt: Date.now()
    }

    this.emit('assessmentSessionStarted', {
      careerPathId,
      domainId,
      assessorNpcId,
      count: questions.length
    })

    return this.currentSession
  }

  getNextQuestion(domainId: string): AssessmentQuestion | null {
    return this.pickNextQuestion(domainId)
  }

  submitAnswer(questionId: string, choiceId: string): SubmitAnswerResult {
    const question = this.questionsById.get(questionId)
    const progressState = this.state.careerPathProgress

    if (!question || !progressState || !this.careerPath) {
      return {
        score: 0,
        feedback: '',
        explanation: '',
        domainScoreChange: 0,
        newDomainScore: 0,
        isCorrect: false,
        stressChange: 0,
        respectChange: 0
      }
    }

    const choice = question.choices.find((c) => c.id === choiceId)
    if (!choice) {
      return {
        score: 0,
        feedback: '',
        explanation: question.explanation,
        domainScoreChange: 0,
        newDomainScore: progressState.domainProgress[question.domainId]?.score ?? 0,
        isCorrect: false,
        stressChange: 0,
        respectChange: 0
      }
    }

    const careerPathId = progressState.careerPathId
    const domainId = question.domainId
    const assessorNpcId =
      this.currentSession?.domainId === domainId ? this.currentSession.assessorNpcId : undefined
    const domainProgress = progressState.domainProgress[domainId] || {
      domainId,
      score: 0,
      answeredQuestions: []
    }

    const oldLevel = this.calculateCurrentLevel()?.id

    const oldScore = domainProgress.score
    const answerScore = clampScore(choice.score)
    const newScore = clampScore(oldScore * 0.8 + answerScore * 0.2)

    domainProgress.score = newScore
    domainProgress.lastAssessmentDate = Date.now()

    if (!domainProgress.answeredQuestions.includes(questionId)) {
      domainProgress.answeredQuestions.push(questionId)
    }

    progressState.domainProgress[domainId] = domainProgress
    this.answeredQuestionIds.add(questionId)

    progressState.totalAssessments = (progressState.totalAssessments || 0) + 1
    progressState.averageScore = this.getAverageScore()

    const scoring = this.getScoringEffects(answerScore)
    const gameState = GameStateManager.getInstance(this.game)
    if (scoring.stressChange !== 0) {
      gameState.addStress(scoring.stressChange)
    }

    if (scoring.respectChange !== 0) {
      gameState.addRespect(scoring.respectChange)
    }

    this.emit('assessmentAnswered', {
      careerPathId,
      questionId,
      choiceId,
      score: answerScore,
      domainId,
      assessorNpcId,
      competencyTags: choice.competencyTags
    })

    this.emit('domainProgressChanged', {
      careerPathId,
      domainId,
      oldScore,
      newScore
    })

    const newLevel = this.calculateCurrentLevel()?.id
    if (oldLevel && newLevel && oldLevel !== newLevel) {
      progressState.currentLevel = newLevel
      this.emit('careerLevelUp', {
        careerPathId,
        oldLevel,
        newLevel
      })
    } else if (newLevel) {
      progressState.currentLevel = newLevel
    }

    const maxChoiceScore = Math.max(...question.choices.map((c) => c.score))
    const isCorrect = choice.score === maxChoiceScore

    const answer: SessionAnswer = {
      questionId,
      choiceId,
      score: answerScore,
      timestamp: Date.now()
    }

    if (this.currentSession && this.currentSession.domainId === domainId) {
      this.currentSession.answers.push(answer)

      const expected = this.currentSession.questions[this.currentSession.currentIndex]
      if (expected && expected.id === questionId) {
        this.currentSession.currentIndex += 1
      }

      if (this.currentSession.currentIndex >= this.currentSession.questions.length) {
        this.endSession()
      }
    }

    return {
      score: answerScore,
      feedback: choice.feedback,
      explanation: question.explanation,
      domainScoreChange: newScore - oldScore,
      newDomainScore: newScore,
      isCorrect,
      stressChange: scoring.stressChange,
      respectChange: scoring.respectChange
    }
  }

  endSession(): SessionResult {
    if (!this.currentSession || !this.state.careerPathProgress) {
      return {
        careerPathId: this.careerPath?.id || '',
        domainId: '',
        questionsCount: 0,
        averageScore: 0,
        domainScoreBefore: 0,
        domainScoreAfter: 0,
        levelUp: false
      }
    }

    const session = this.currentSession
    const progress = this.state.careerPathProgress.domainProgress[session.domainId]
    const domainScoreAfter = progress?.score ?? 0
    const domainScoreBefore = this.sessionDomainScoreBefore ?? domainScoreAfter

    const avg = session.answers.length
      ? session.answers.reduce((acc, a) => acc + a.score, 0) / session.answers.length
      : 0

    const oldLevel = this.state.careerPathProgress.currentLevel
    const newLevel = this.calculateCurrentLevel()?.id

    const levelUp = Boolean(newLevel && oldLevel && newLevel !== oldLevel)

    if (newLevel) {
      this.state.careerPathProgress.currentLevel = newLevel
    }

    const result: SessionResult = {
      careerPathId: session.careerPathId,
      domainId: session.domainId,
      questionsCount: session.questions.length,
      averageScore: avg,
      domainScoreBefore,
      domainScoreAfter,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    }

    this.emit('assessmentSessionCompleted', result)

    this.currentSession = null
    this.sessionDomainScoreBefore = null

    return result
  }

  getDomainProgress(domainId: string): DomainProgress {
    const progress = this.state.careerPathProgress?.domainProgress?.[domainId]
    if (progress) return progress

    return {
      domainId,
      score: 0,
      answeredQuestions: []
    }
  }

  getAllProgress(): Record<string, DomainProgress> {
    return this.state.careerPathProgress?.domainProgress || {}
  }

  getCurrentLevel(): CareerPathLevel | null {
    if (!this.careerPath) return null

    return this.calculateCurrentLevel()
  }

  getAverageScore(): number {
    const progress = Object.values(this.state.careerPathProgress?.domainProgress || {})
    if (progress.length === 0) return 0

    const sum = progress.reduce((acc, d) => acc + clampScore(d.score), 0)

    return sum / progress.length
  }

  canLevelUp(): boolean {
    if (!this.careerPath || !this.state.careerPathProgress) return false

    const levels = this.careerPath.levels
    const currentId = this.calculateCurrentLevel()?.id
    if (!currentId) return false

    const idx = levels.findIndex((l) => l.id === currentId)
    if (idx < 0 || idx >= levels.length - 1) return false

    const next = levels[idx + 1]
    const avg = this.getAverageScore()
    const progress = Object.values(this.state.careerPathProgress.domainProgress)
    const allDomainsAboveMin = progress.every((d) => d.score >= next.minDomainScore)

    return avg >= next.minAvgScore && allDomainsAboveMin
  }

  promote(): boolean {
    if (!this.canLevelUp() || !this.state.careerPathProgress) return false

    const oldLevel = this.state.careerPathProgress.currentLevel
    const newLevel = this.calculateCurrentLevel()?.id
    if (!newLevel || newLevel === oldLevel) return false

    this.state.careerPathProgress.currentLevel = newLevel
    this.emit('careerLevelUp', {
      careerPathId: this.state.careerPathProgress.careerPathId,
      oldLevel,
      newLevel
    })

    return true
  }

  getAvailableDomains(): CompetencyDomain[] {
    if (!this.careerPath) return []

    const progress = Object.values(this.state.careerPathProgress?.domainProgress || {})

    return this.careerPath.domains.filter((domain) => {
      const unlock = domain.unlockCondition
      if (!unlock) return true

      const minScoreInAnyDomain = unlock.minScoreInAnyDomain
      const minDomainsWithScore = unlock.minDomainsWithScore

      if (minScoreInAnyDomain !== undefined) {
        const hasAny = progress.some((p) => p.score >= minScoreInAnyDomain)
        if (!hasAny) return false
      }

      if (minDomainsWithScore) {
        const count = progress.filter((p) => p.score >= minDomainsWithScore.minScore).length
        if (count < minDomainsWithScore.count) return false
      }

      return true
    })
  }

  getAssessmentState(): AssessmentState {
    return cloneAssessmentState(this.state)
  }

  loadState(state: AssessmentState): void {
    this.state = cloneAssessmentState(state)
    const id = state.chosenCareerPathId || state.careerPathProgress?.careerPathId
    if (id) {
      this.careerPath = getCareerPath(id) || null
    } else {
      this.careerPath = null
    }

    this.rebuildQuestionsIndex()

    const answered: Set<string> = new Set()
    const progress = this.state.careerPathProgress?.domainProgress || {}
    for (const d of Object.values(progress)) {
      for (const qid of d.answeredQuestions) {
        answered.add(qid)
      }
    }

    this.answeredQuestionIds = answered
  }

  reset(): void {
    this.careerPath = null
    this.state = {}
    this.questionsByDomain = new Map()
    this.questionsById = new Map()
    this.answeredQuestionIds = new Set()
    this.currentSession = null
    this.sessionDomainScoreBefore = null
  }

  private calculateCurrentLevel(): CareerPathLevel | null {
    if (!this.careerPath || !this.state.careerPathProgress) return null

    const levels = this.careerPath.levels
    if (levels.length === 0) return null

    const avgScore = this.getAverageScore()
    const progress = Object.values(this.state.careerPathProgress.domainProgress)

    for (let i = levels.length - 1; i >= 0; i--) {
      const level = levels[i]
      const allDomainsAboveMin = progress.every((d) => d.score >= level.minDomainScore)

      if (avgScore >= level.minAvgScore && allDomainsAboveMin) {
        return level
      }
    }

    return levels[0]
  }

  private rebuildQuestionsIndex(): void {
    this.questionsByDomain = new Map()
    this.questionsById = new Map()

    if (!this.careerPath) return

    for (const domain of this.careerPath.domains) {
      const questions: AssessmentQuestion[] = []
      for (const topic of domain.topics) {
        for (const q of topic.questions) {
          questions.push(q)
          this.questionsById.set(q.id, q)
        }
      }
      this.questionsByDomain.set(domain.id, questions)
    }
  }

  private pickNextQuestion(
    domainId: string,
    extraExcluded?: Set<string>
  ): AssessmentQuestion | null {
    if (!this.careerPath || !this.state.careerPathProgress) return null

    const progress = this.state.careerPathProgress.domainProgress[domainId]
    const domainScore = progress?.score ?? 0

    const pool = this.questionsByDomain.get(domainId) || []
    if (pool.length === 0) return null

    const excluded = new Set<string>(this.answeredQuestionIds)
    if (extraExcluded) {
      for (const id of extraExcluded) {
        excluded.add(id)
      }
    }

    const allowed = new Set(getAllowedDifficulties(domainScore))

    const candidates = pool.filter((q) => !excluded.has(q.id) && allowed.has(q.difficulty))
    if (candidates.length === 0) return null

    const idx = Math.floor(Math.random() * candidates.length)

    return candidates[idx]
  }

  private getScoringEffects(
    answerScore: number
  ): { stressChange: number; respectChange: number } {
    if (answerScore >= ASSESSMENT_SCORING.excellent.minScore) {
      return {
        stressChange: ASSESSMENT_SCORING.excellent.stress,
        respectChange: ASSESSMENT_SCORING.excellent.respect
      }
    }

    if (answerScore >= ASSESSMENT_SCORING.good.minScore) {
      return {
        stressChange: ASSESSMENT_SCORING.good.stress,
        respectChange: ASSESSMENT_SCORING.good.respect
      }
    }

    if (answerScore >= ASSESSMENT_SCORING.poor.minScore) {
      return {
        stressChange: ASSESSMENT_SCORING.poor.stress,
        respectChange: ASSESSMENT_SCORING.poor.respect
      }
    }

    return {
      stressChange: ASSESSMENT_SCORING.fail.stress,
      respectChange: ASSESSMENT_SCORING.fail.respect
    }
  }

  private emit(
    event: string,
    payload: unknown
  ): void {
    this.game.events.emit(event, payload)
  }
}
