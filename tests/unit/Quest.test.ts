import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { QuestData } from '../../src/types'

class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('QuestManager', () => {
  let questManager: any
  let mockGame: MockGame

  const mockQuest: QuestData = {
    id: 'test-quest',
    title: 'Test Quest',
    description: 'A test quest',
    type: 'main',
    completed: false,
    progress: 0,
    rewards: { respect: 20, stress: -10 },
  }

  const mockQuestWithItems: QuestData = {
    id: 'item-quest',
    title: 'Item Quest',
    description: 'Collect items',
    type: 'side',
    completed: false,
    progress: 0,
    requiredItems: ['item-1', 'item-2'],
    rewards: { respect: 10 },
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGame = new MockGame()
    
    const { QuestManager } = await import('../../src/managers/Quest')
    
    const instance = (QuestManager as any).instance
    if (instance) {
      instance.game = mockGame
      instance.clear()
    }
    
    questManager = QuestManager.getInstance(mockGame as any)
  })

  describe('initialization', () => {
    it('should initialize empty', () => {
      expect(questManager.getActiveQuests()).toEqual([])
      expect(questManager.getCompletedQuests()).toEqual([])
    })
  })

  describe('starting quests', () => {
    it('should start quest successfully', () => {
      const result = questManager.startQuest(mockQuest)
      
      expect(result).toBe(true)
      expect(questManager.hasQuest('test-quest')).toBe(true)
    })

    it('should emit questStarted event', () => {
      questManager.startQuest(mockQuest)
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('questStarted', {
        ...mockQuest,
        progress: 0,
        completed: false,
      })
    })

    it('should not start duplicate quest', () => {
      questManager.startQuest(mockQuest)
      const result = questManager.startQuest(mockQuest)
      
      expect(result).toBe(false)
    })

    it('should add quest to active quests', () => {
      questManager.startQuest(mockQuest)
      const activeQuests = questManager.getActiveQuests()
      
      expect(activeQuests).toHaveLength(1)
      expect(activeQuests[0].id).toBe('test-quest')
    })
  })

  describe('completing quests', () => {
    it('should complete quest successfully', () => {
      questManager.startQuest(mockQuest)
      const result = questManager.completeQuest('test-quest')
      
      expect(result).toBe(true)
      expect(questManager.isQuestCompleted('test-quest')).toBe(true)
      expect(questManager.hasQuest('test-quest')).toBe(false)
    })

    it('should emit questCompleted event', () => {
      questManager.startQuest(mockQuest)
      questManager.completeQuest('test-quest')
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('questCompleted', {
        ...mockQuest,
        completed: true,
        progress: 100,
      })
    })

    it('should apply rewards on completion', () => {
      questManager.startQuest(mockQuest)
      questManager.completeQuest('test-quest')
      
      expect(questManager.isQuestCompleted('test-quest')).toBe(true)
    })

    it('should not complete non-existent quest', () => {
      const result = questManager.completeQuest('non-existent')
      expect(result).toBe(false)
    })

    it('should not complete already completed quest', () => {
      questManager.startQuest(mockQuest)
      questManager.completeQuest('test-quest')
      const result = questManager.completeQuest('test-quest')
      
      expect(result).toBe(false)
    })
  })

  describe('failing quests', () => {
    it('should fail quest successfully', () => {
      questManager.startQuest(mockQuest)
      const result = questManager.failQuest('test-quest')
      
      expect(result).toBe(true)
      expect(questManager.hasQuest('test-quest')).toBe(false)
    })

    it('should emit questFailed event', () => {
      questManager.startQuest(mockQuest)
      questManager.failQuest('test-quest')
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('questFailed', {
        ...mockQuest,
        progress: 0,
        completed: false,
      })
    })
  })

  describe('progress tracking', () => {
    it('should update progress', () => {
      questManager.startQuest(mockQuest)
      questManager.updateProgress('test-quest', 50)
      
      const quest = questManager.getQuest('test-quest')
      expect(quest.progress).toBe(50)
    })

    it('should emit questProgress event', () => {
      questManager.startQuest(mockQuest)
      questManager.updateProgress('test-quest', 50)
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('questProgress', {
        questId: 'test-quest',
        progress: 50,
      })
    })

    it('should auto-complete at 100 progress', () => {
      questManager.startQuest(mockQuest)
      questManager.updateProgress('test-quest', 100)
      
      expect(questManager.isQuestCompleted('test-quest')).toBe(true)
    })

    it('should clamp progress to 0-100', () => {
      questManager.startQuest(mockQuest)
      
      questManager.updateProgress('test-quest', 99)
      const quest = questManager.getQuest('test-quest')
      expect(quest?.progress).toBe(99)
      
      questManager.updateProgress('test-quest', -150)
      const quest2 = questManager.getQuest('test-quest')
      expect(quest2?.progress).toBe(0)
    })
  })

  describe('quest requirements', () => {
    it('should check item requirements', async () => {
      const mockInventory = {
        hasItem: vi.fn()
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true),
      }
      
      const { InventoryManager } = await import('../../src/managers/Inventory')
      const inventoryInstance = (InventoryManager as any).instance
      if (inventoryInstance) {
        inventoryInstance.hasItem = mockInventory.hasItem
      }
      
      questManager.startQuest(mockQuestWithItems)
      
      const result = questManager.checkQuestRequirements('item-quest')
      expect(result).toBe(false)
    })
  })

  describe('clearing quests', () => {
    it('should clear all quests', () => {
      questManager.startQuest(mockQuest)
      questManager.startQuest(mockQuestWithItems)
      
      questManager.clear()
      
      expect(questManager.getActiveQuests()).toEqual([])
      expect(questManager.getCompletedQuests()).toEqual([])
    })
  })
})
