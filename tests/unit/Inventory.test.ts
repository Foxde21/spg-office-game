import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { ItemData } from '../../src/types'

class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('InventoryManager', () => {
  let inventory: any
  let mockGame: MockGame

  const mockItem: ItemData = {
    id: 'test-item',
    name: 'Test Item',
    description: 'A test item',
    sprite: 'item',
    type: 'consumable',
    usable: true,
    effects: { stress: -10 },
  }

  const mockQuestItem: ItemData = {
    id: 'quest-item',
    name: 'Quest Item',
    description: 'A quest item',
    sprite: 'item',
    type: 'quest',
    usable: false,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGame = new MockGame()
    
    const { InventoryManager } = await import('../../src/managers/Inventory')
    
    const instance = (InventoryManager as any).instance
    if (instance) {
      instance.game = mockGame
      instance.clear()
    }
    
    inventory = InventoryManager.getInstance(mockGame as any)
  })

  describe('initialization', () => {
    it('should initialize empty', () => {
      expect(inventory.getCount()).toBe(0)
      expect(inventory.getAllItems()).toEqual([])
    })
  })

  describe('adding items', () => {
    it('should add item successfully', () => {
      const result = inventory.addItem(mockItem)
      expect(result).toBe(true)
      expect(inventory.getCount()).toBe(1)
      expect(inventory.hasItem('test-item')).toBe(true)
    })

    it('should emit itemAdded event', () => {
      inventory.addItem(mockItem)
      expect(mockGame.events.emit).toHaveBeenCalledWith('itemAdded', mockItem)
    })

    it('should not add more than 16 items', () => {
      for (let i = 0; i < 16; i++) {
        inventory.addItem({ ...mockItem, id: `item-${i}` })
      }
      
      const result = inventory.addItem({ ...mockItem, id: 'item-17' })
      expect(result).toBe(false)
      expect(inventory.getCount()).toBe(16)
    })

    it('should detect full inventory', () => {
      expect(inventory.isFull()).toBe(false)
      
      for (let i = 0; i < 16; i++) {
        inventory.addItem({ ...mockItem, id: `item-${i}` })
      }
      
      expect(inventory.isFull()).toBe(true)
    })
  })

  describe('removing items', () => {
    it('should remove item successfully', () => {
      inventory.addItem(mockItem)
      const result = inventory.removeItem('test-item')
      
      expect(result).toBe(true)
      expect(inventory.hasItem('test-item')).toBe(false)
    })

    it('should emit itemRemoved event', () => {
      inventory.addItem(mockItem)
      inventory.removeItem('test-item')
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('itemRemoved', 'test-item')
    })

    it('should return false when removing non-existent item', () => {
      const result = inventory.removeItem('non-existent')
      expect(result).toBe(false)
    })
  })

  describe('using items', () => {
    it('should use usable item', () => {
      inventory.addItem(mockItem)
      const result = inventory.useItem('test-item')
      
      expect(result).toEqual(mockItem)
      expect(inventory.hasItem('test-item')).toBe(false)
    })

    it('should emit itemUsed event', () => {
      inventory.addItem(mockItem)
      inventory.useItem('test-item')
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('itemUsed', mockItem)
    })

    it('should not use non-usable item', () => {
      inventory.addItem(mockQuestItem)
      const result = inventory.useItem('quest-item')
      
      expect(result).toBeNull()
      expect(inventory.hasItem('quest-item')).toBe(true)
    })

    it('should return null for non-existent item', () => {
      const result = inventory.useItem('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('getting items', () => {
    it('should get item by id', () => {
      inventory.addItem(mockItem)
      const item = inventory.getItem('test-item')
      
      expect(item).toEqual(mockItem)
    })

    it('should return undefined for non-existent item', () => {
      const item = inventory.getItem('non-existent')
      expect(item).toBeUndefined()
    })

    it('should get all items', () => {
      inventory.addItem(mockItem)
      inventory.addItem(mockQuestItem)
      
      const items = inventory.getAllItems()
      expect(items).toHaveLength(2)
      expect(items).toContainEqual(mockItem)
      expect(items).toContainEqual(mockQuestItem)
    })
  })

  describe('clearing inventory', () => {
    it('should clear all items', () => {
      inventory.addItem(mockItem)
      inventory.addItem(mockQuestItem)
      
      inventory.clear()
      
      expect(inventory.getCount()).toBe(0)
      expect(inventory.getAllItems()).toEqual([])
    })
  })
})
