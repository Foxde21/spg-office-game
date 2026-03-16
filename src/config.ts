export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720

export const COLORS = {
  primary: 0x6c5ce7,
  secondary: 0xa29bfe,
  background: 0x2d2d44,
  text: 0xffffff,
  textDark: 0x2d2d44,
  success: 0x00b894,
  warning: 0xfdcb6e,
  danger: 0xe17055,
}

export const DEFAULT_CAREER_PATH_UNLOCK_RESPECT = 20

export const CAREER_PATH_UNLOCK_RESPECT = DEFAULT_CAREER_PATH_UNLOCK_RESPECT

export const ASSESSMENT_SCORING = {
  excellent: { minScore: 80, respect: 3, stress: -2 },
  good: { minScore: 50, respect: 1, stress: 0 },
  poor: { minScore: 25, respect: 0, stress: 3 },
  fail: { minScore: 0, respect: -2, stress: 5 }
} as const

export const CAREER_LEVELS = [
  { id: 'junior', title: 'Junior Developer', stress: 0, respect: 0 },
  { id: 'middle', title: 'Middle Developer', stress: 30, respect: 25 },
  { id: 'senior', title: 'Senior Developer', stress: 50, respect: 50 },
  { id: 'lead', title: 'Team Lead', stress: 70, respect: 75 },
] as const

export type CareerLevel = typeof CAREER_LEVELS[number]['id']

export const SPRITE = {
  frameWidth: 32,
  frameHeight: 42,
  playerIndex: 0,
}
