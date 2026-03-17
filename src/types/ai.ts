export interface NPCPersonality {
  name: string
  role: string
  personality: string
  speechStyle: string
  relationshipWithPlayer: string
  goals: string[]
  topics: string[]
}

export interface AIContext {
  playerName: string
  careerLevel: string
  careerPath?: string
  stress: number
  respect: number
  npcId: string
  relationship: number
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
  previousTopics: string[]
}

export interface AIResponse {
  text: string
  stressChange?: number
  respectChange?: number
}
