import Phaser from 'phaser'
import type { SaveData } from '../types'
import { GameStateManager } from './GameState'
import { InventoryManager } from './Inventory'
import { QuestManager } from './Quest'

const SAVE_VERSION = '1.0.0'
const SAVE_KEY = 'officequest_save'
const AUTO_SAVE_INTERVAL = 60000

export class SaveManager {
  private static instance: SaveManager
  private game: Phaser.Game
  private autoSaveTimer?: number

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): SaveManager {
    if (!SaveManager.instance && game) {
      SaveManager.instance = new SaveManager(game)
    }
    return SaveManager.instance
  }

  save(): boolean {
    try {
      const gameState = GameStateManager.getInstance(this.game)
      const inventory = InventoryManager.getInstance(this.game)
      const questManager = QuestManager.getInstance(this.game)

      const saveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        player: gameState.getPlayer(),
        inventory: inventory.getAllItems(),
        activeQuests: questManager.getActiveQuests(),
        completedQuests: questManager.getCompletedQuests(),
        npcs: gameState.getState().npcs,
        flags: gameState.getState().flags,
      }

      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
      this.game.events.emit('gameSaved', saveData)
      return true
    } catch (error) {
      console.error('Failed to save game:', error)
      return false
    }
  }

  load(): SaveData | null {
    try {
      const data = localStorage.getItem(SAVE_KEY)
      if (!data) return null

      const saveData = JSON.parse(data) as SaveData
      
      const migratedData = this.migrateSaveData(saveData)
      
      const gameState = GameStateManager.getInstance(this.game)
      const inventory = InventoryManager.getInstance(this.game)
      const questManager = QuestManager.getInstance(this.game)

      gameState.setState({
        player: migratedData.player,
        npcs: migratedData.npcs || {},
        flags: migratedData.flags || {},
      })

      inventory.clear()
      if (migratedData.inventory) {
        inventory.loadItems(migratedData.inventory)
      }

      questManager.clear()
      if (migratedData.activeQuests) {
        migratedData.activeQuests.forEach((quest) => {
          questManager.startQuest(quest)
        })
      }

      this.game.events.emit('gameLoaded', migratedData)
      return migratedData
    } catch (error) {
      console.error('Failed to load game:', error)
      return null
    }
  }

  private migrateSaveData(data: SaveData): SaveData {
    if (data.version === SAVE_VERSION) {
      return data
    }

    const migrated = { ...data }

    if (!migrated.version) {
      migrated.version = SAVE_VERSION
    }

    if (!migrated.npcs) {
      migrated.npcs = {}
    }

    if (!migrated.flags) {
      migrated.flags = {}
    }

    if (!migrated.inventory) {
      migrated.inventory = []
    }

    if (!migrated.activeQuests) {
      migrated.activeQuests = []
    }

    if (!migrated.completedQuests) {
      migrated.completedQuests = []
    }

    return migrated
  }

  hasSave(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null
  }

  deleteSave(): boolean {
    try {
      localStorage.removeItem(SAVE_KEY)
      this.game.events.emit('saveDeleted')
      return true
    } catch (error) {
      console.error('Failed to delete save:', error)
      return false
    }
  }

  getSaveInfo(): { timestamp: number; version: string } | null {
    try {
      const data = localStorage.getItem(SAVE_KEY)
      if (!data) return null

      const saveData = JSON.parse(data) as SaveData
      return {
        timestamp: saveData.timestamp,
        version: saveData.version,
      }
    } catch (error) {
      return null
    }
  }

  startAutoSave(): void {
    this.stopAutoSave()
    
    this.autoSaveTimer = window.setInterval(() => {
      this.save()
    }, AUTO_SAVE_INTERVAL)
  }

  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = undefined
    }
  }

  exportSave(): string | null {
    try {
      const data = localStorage.getItem(SAVE_KEY)
      return data
    } catch (error) {
      console.error('Failed to export save:', error)
      return null
    }
  }

  importSave(saveString: string): boolean {
    try {
      const saveData = JSON.parse(saveString) as SaveData
      
      if (!saveData.version || !saveData.timestamp || !saveData.player) {
        throw new Error('Invalid save data')
      }

      localStorage.setItem(SAVE_KEY, saveString)
      return true
    } catch (error) {
      console.error('Failed to import save:', error)
      return false
    }
  }
}
