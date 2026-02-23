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

export interface ItemData {
  id: string
  name: string
  description: string
  sprite: string
  usable: boolean
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
