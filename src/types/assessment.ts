export interface CareerPathLevel {
  id: string
  title: string
  minAvgScore: number
  minDomainScore: number
}

export interface NPCAssessorConfig {
  npcId: string
  domainIds: string[]
  unlockCondition?: {
    minAvgScore?: number
    minDomainsUnlocked?: number
  }
}

export interface AssessmentChoice {
  id: string
  text: string
  score: number
  feedback: string
  competencyTags: string[]
}

export interface AssessmentQuestion {
  id: string
  scenario: string
  question: string
  choices: AssessmentChoice[]
  explanation: string
  domainId: string
  difficulty: 1 | 2 | 3 | 4
}

export interface CompetencyTopic {
  id: string
  name: string
  level: string
  questions: AssessmentQuestion[]
}

export interface CompetencyDomain {
  id: string
  name: string
  description: string
  icon: string
  careerPathId: string
  topics: CompetencyTopic[]
  unlockCondition?: {
    minScoreInAnyDomain?: number
    minDomainsWithScore?: { count: number; minScore: number }
  }
}

export interface CareerPath {
  id: string
  name: string
  description: string
  icon: string
  levels: CareerPathLevel[]
  domains: CompetencyDomain[]
  npcAssessors: NPCAssessorConfig[]
  unlockCondition?: {
    minRespect?: number
    requiredFlag?: string
    requiredQuest?: string
  }
  finalQuestId?: string
}

export interface DomainProgress {
  domainId: string
  score: number
  answeredQuestions: string[]
  lastAssessmentDate?: number
}

export interface CareerPathProgress {
  careerPathId: string
  currentLevel: string
  domainProgress: Record<string, DomainProgress>
  totalAssessments: number
  averageScore: number
}

export interface AssessmentState {
  chosenCareerPathId?: string
  careerPathProgress?: CareerPathProgress
}

export interface SessionAnswer {
  questionId: string
  choiceId: string
  score: number
  timestamp: number
}

export interface AssessmentSession {
  careerPathId: string
  domainId: string
  assessorNpcId?: string
  questions: AssessmentQuestion[]
  currentIndex: number
  answers: SessionAnswer[]
  startedAt: number
}

export interface SubmitAnswerResult {
  score: number
  feedback: string
  explanation: string
  domainScoreChange: number
  newDomainScore: number
  isCorrect: boolean
  stressChange: number
  respectChange: number
}

export interface SessionResult {
  careerPathId: string
  domainId: string
  questionsCount: number
  averageScore: number
  domainScoreBefore: number
  domainScoreAfter: number
  levelUp: boolean
  newLevel?: string
}
