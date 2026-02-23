export interface DialogueLine {
  speaker: string
  text: string
  choices?: DialogueChoice[]
}

export interface DialogueChoice {
  text: string
  nextDialogue?: string
  action?: string
  stressChange?: number
  respectChange?: number
  giveItem?: string
  takeItem?: string
  startQuest?: string
  completeQuest?: string
  condition?: {
    hasItem?: string
    hasRespect?: number
    hasStress?: number
    hasQuest?: string
    questCompleted?: string
  }
}

export interface Dialogue {
  id: string
  lines: DialogueLine[]
}

export interface NPCData {
  id: string
  name: string
  role: string
  sprite: string
  dialogues: Dialogue[]
}

export type ItemType = 'consumable' | 'quest' | 'document'

export interface ItemData {
  id: string
  name: string
  description: string
  sprite: string
  type: ItemType
  usable: boolean
  effects?: ItemEffects
}

export interface ItemEffects {
  stress?: number
  respect?: number
}

export type QuestType = 'main' | 'side' | 'daily'

export interface QuestData {
  id: string
  title: string
  description: string
  type: QuestType
  completed: boolean
  progress: number
  requiredItems?: string[]
  requiredDialogues?: string[]
  rewards?: {
    respect?: number
    stress?: number
  }
  penalties?: {
    respect?: number
    stress?: number
  }
}

export interface PlayerData {
  name: string
  careerLevel: string
  stress: number
  respect: number
  inventory: string[]
  completedQuests: string[]
  currentQuests: string[]
  x?: number
  y?: number
}

export interface NPCState {
  id: string
  relationship: number
  seenDialogues: string[]
}

export interface GameState {
  player: PlayerData
  npcs: Record<string, NPCState>
  flags: Record<string, boolean>
}

export interface SaveData {
  version: string
  timestamp: number
  player: PlayerData
  inventory: ItemData[]
  activeQuests: QuestData[]
  completedQuests: string[]
  npcs: Record<string, NPCState>
  flags: Record<string, boolean>
}

export * from './ai'
export * from './Location'
