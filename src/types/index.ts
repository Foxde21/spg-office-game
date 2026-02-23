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

export interface QuestData {
  id: string
  title: string
  description: string
  completed: boolean
  requiredItems?: string[]
  requiredDialogues?: string[]
}

export interface PlayerData {
  name: string
  careerLevel: string
  stress: number
  respect: number
  inventory: string[]
  completedQuests: string[]
  currentQuests: string[]
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
