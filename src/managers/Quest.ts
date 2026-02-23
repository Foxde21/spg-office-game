import Phaser from 'phaser'
import type { QuestData } from '../types'
import { GameStateManager } from './GameState'
import { InventoryManager } from './Inventory'

export class QuestManager {
  private static instance: QuestManager
  private game: Phaser.Game
  private quests: Map<string, QuestData> = new Map()
  private completedQuests: Set<string> = new Set()

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): QuestManager {
    if (!QuestManager.instance && game) {
      QuestManager.instance = new QuestManager(game)
    }
    return QuestManager.instance
  }

  startQuest(quest: QuestData): boolean {
    if (this.quests.has(quest.id)) {
      return false
    }

    quest.progress = 0
    quest.completed = false
    this.quests.set(quest.id, quest)
    this.game.events.emit('questStarted', quest)
    return true
  }

  completeQuest(questId: string): boolean {
    const quest = this.quests.get(questId)
    if (!quest || quest.completed) return false

    quest.completed = true
    quest.progress = 100
    this.completedQuests.add(questId)
    this.quests.delete(questId)

    if (quest.rewards) {
      const gameState = GameStateManager.getInstance(this.game)
      if (quest.rewards.respect) {
        gameState.addRespect(quest.rewards.respect)
      }
      if (quest.rewards.stress) {
        gameState.addStress(quest.rewards.stress)
      }
    }

    this.game.events.emit('questCompleted', quest)
    return true
  }

  failQuest(questId: string): boolean {
    const quest = this.quests.get(questId)
    if (!quest) return false

    if (quest.penalties) {
      const gameState = GameStateManager.getInstance(this.game)
      if (quest.penalties.respect) {
        gameState.reduceRespect(quest.penalties.respect)
      }
      if (quest.penalties.stress) {
        gameState.addStress(quest.penalties.stress)
      }
    }

    this.quests.delete(questId)
    this.game.events.emit('questFailed', quest)
    return true
  }

  updateProgress(questId: string, progress: number): void {
    const quest = this.quests.get(questId)
    if (!quest) return

    quest.progress = Math.min(100, Math.max(0, progress))
    this.game.events.emit('questProgress', { questId, progress: quest.progress })

    if (quest.progress >= 100) {
      this.completeQuest(questId)
    }
  }

  checkQuestRequirements(questId: string): boolean {
    const quest = this.quests.get(questId)
    if (!quest) return false

    if (quest.requiredItems && quest.requiredItems.length > 0) {
      const inventory = InventoryManager.getInstance(this.game)
      for (const itemId of quest.requiredItems) {
        if (!inventory.hasItem(itemId)) {
          return false
        }
      }
    }

    if (quest.requiredDialogues && quest.requiredDialogues.length > 0) {
      for (const dialogueId of quest.requiredDialogues) {
        if (!this.completedQuests.has(dialogueId)) {
          return false
        }
      }
    }

    return true
  }

  hasQuest(questId: string): boolean {
    return this.quests.has(questId)
  }

  isQuestCompleted(questId: string): boolean {
    return this.completedQuests.has(questId)
  }

  getQuest(questId: string): QuestData | undefined {
    return this.quests.get(questId)
  }

  getActiveQuests(): QuestData[] {
    return Array.from(this.quests.values())
  }

  getCompletedQuests(): string[] {
    return Array.from(this.completedQuests)
  }

  clear(): void {
    this.quests.clear()
    this.completedQuests.clear()
  }
}
