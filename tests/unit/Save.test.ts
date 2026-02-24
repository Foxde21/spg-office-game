import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('SaveManager', () => {
  let saveManager: any
  let mockGame: MockGame

  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()
    mockGame = new MockGame()
    
    const { SaveManager } = await import('../../src/managers/Save')
    const { GameStateManager } = await import('../../src/managers/GameState')
    const { InventoryManager } = await import('../../src/managers/Inventory')
    const { QuestManager } = await import('../../src/managers/Quest')
    
    const saveInstance = (SaveManager as any).instance
    if (saveInstance) {
      saveInstance.game = mockGame
    }
    
    const gsInstance = (GameStateManager as any).instance
    if (gsInstance) {
      gsInstance.game = mockGame
      gsInstance.reset()
    }
    
    const invInstance = (InventoryManager as any).instance
    if (invInstance) {
      invInstance.game = mockGame
      invInstance.clear()
    }
    
    const questInstance = (QuestManager as any).instance
    if (questInstance) {
      questInstance.game = mockGame
      questInstance.clear()
    }
    
    GameStateManager.getInstance(mockGame as any)
    InventoryManager.getInstance(mockGame as any)
    QuestManager.getInstance(mockGame as any)
    saveManager = SaveManager.getInstance(mockGame as any)
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('should be a singleton', async () => {
      const { SaveManager } = await import('../../src/managers/Save')
      const instance1 = SaveManager.getInstance(mockGame as any)
      const instance2 = SaveManager.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('save', () => {
    it('should save game state to localStorage', () => {
      const success = saveManager.save()
      expect(success).toBe(true)
      expect(localStorage.getItem('officequest_save')).not.toBeNull()
    })

    it('should emit gameSaved event', () => {
      saveManager.save()
      expect(mockGame.events.emit).toHaveBeenCalledWith('gameSaved', expect.any(Object))
    })

    it('should include version in save data', () => {
      saveManager.save()
      const data = JSON.parse(localStorage.getItem('officequest_save')!)
      expect(data.version).toBe('1.0.0')
    })

    it('should include timestamp in save data', () => {
      saveManager.save()
      const data = JSON.parse(localStorage.getItem('officequest_save')!)
      expect(data.timestamp).toBeDefined()
    })
  })

  describe('load', () => {
    it('should return null if no save exists', () => {
      const data = saveManager.load()
      expect(data).toBeNull()
    })

    it('should load saved game state', () => {
      saveManager.save()
      const data = saveManager.load()
      expect(data).not.toBeNull()
      expect(data.version).toBe('1.0.0')
    })

    it('should emit gameLoaded event', () => {
      saveManager.save()
      mockGame.events.emit.mockClear()
      saveManager.load()
      expect(mockGame.events.emit).toHaveBeenCalledWith('gameLoaded', expect.any(Object))
    })
  })

  describe('hasSave', () => {
    it('should return false if no save exists', () => {
      expect(saveManager.hasSave()).toBe(false)
    })

    it('should return true if save exists', () => {
      saveManager.save()
      expect(saveManager.hasSave()).toBe(true)
    })
  })

  describe('deleteSave', () => {
    it('should delete saved game', () => {
      saveManager.save()
      expect(saveManager.hasSave()).toBe(true)
      
      saveManager.deleteSave()
      expect(saveManager.hasSave()).toBe(false)
    })

    it('should emit saveDeleted event', () => {
      saveManager.save()
      mockGame.events.emit.mockClear()
      saveManager.deleteSave()
      expect(mockGame.events.emit).toHaveBeenCalledWith('saveDeleted')
    })
  })

  describe('getSaveInfo', () => {
    it('should return null if no save exists', () => {
      expect(saveManager.getSaveInfo()).toBeNull()
    })

    it('should return save info', () => {
      saveManager.save()
      const info = saveManager.getSaveInfo()
      expect(info).not.toBeNull()
      expect(info!.version).toBe('1.0.0')
      expect(info!.timestamp).toBeDefined()
    })
  })

  describe('exportSave', () => {
    it('should return null if no save exists', () => {
      expect(saveManager.exportSave()).toBeNull()
    })

    it('should return save string', () => {
      saveManager.save()
      const saveString = saveManager.exportSave()
      expect(saveString).not.toBeNull()
      const data = JSON.parse(saveString!)
      expect(data.version).toBe('1.0.0')
    })
  })

  describe('importSave', () => {
    it('should import valid save data', () => {
      saveManager.save()
      const saveString = saveManager.exportSave()
      saveManager.deleteSave()
      
      const success = saveManager.importSave(saveString!)
      expect(success).toBe(true)
      expect(saveManager.hasSave()).toBe(true)
    })

    it('should reject invalid save data', () => {
      const success = saveManager.importSave('invalid json')
      expect(success).toBe(false)
    })

    it('should reject save without required fields', () => {
      const invalidData = JSON.stringify({ version: '1.0.0' })
      const success = saveManager.importSave(invalidData)
      expect(success).toBe(false)
    })
  })

  describe('autoSave', () => {
    it('should start auto save timer', () => {
      vi.useFakeTimers()
      saveManager.startAutoSave()
      saveManager.save = vi.fn()
      
      vi.advanceTimersByTime(60000)
      expect(saveManager.save).toHaveBeenCalled()
      
      saveManager.stopAutoSave()
      vi.useRealTimers()
    })

    it('should stop auto save timer', () => {
      vi.useFakeTimers()
      saveManager.startAutoSave()
      saveManager.stopAutoSave()
      saveManager.save = vi.fn()
      
      vi.advanceTimersByTime(60000)
      expect(saveManager.save).not.toHaveBeenCalled()
      
      vi.useRealTimers()
    })
  })
})
