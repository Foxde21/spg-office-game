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
  stress: number
  respect: number
  npcId: string
  relationship: number
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  previousTopics: string[]
}

export interface AIResponse {
  text: string
  stressChange?: number
  respectChange?: number
}
