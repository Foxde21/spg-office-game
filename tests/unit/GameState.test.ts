import { describe, it, expect, beforeEach, vi } from 'vitest'

class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('GameStateManager', () => {
  let gameState: any
  let mockGame: MockGame

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGame = new MockGame()
    
    const { GameStateManager } = await import('../../src/managers/GameState')
    
    const instance = (GameStateManager as any).instance
    if (instance) {
      instance.game = mockGame
      instance.reset()
    }
    
    gameState = GameStateManager.getInstance(mockGame as any)
  })

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(gameState.getStress()).toBe(0)
      expect(gameState.getRespect()).toBe(0)
      expect(gameState.getCareerLevel()).toBe('junior')
    })
  })

  describe('stress management', () => {
    it('should add stress correctly', () => {
      gameState.addStress(10)
      expect(gameState.getStress()).toBe(10)
      expect(mockGame.events.emit).toHaveBeenCalledWith('stressChanged', {
        old: 0,
        new: 10,
      })
    })

    it('should not exceed 100 stress', () => {
      gameState.addStress(150)
      expect(gameState.getStress()).toBe(100)
    })

    it('should reduce stress correctly', () => {
      gameState.addStress(30)
      gameState.reduceStress(10)
      expect(gameState.getStress()).toBe(20)
    })

    it('should not go below 0 stress', () => {
      gameState.reduceStress(10)
      expect(gameState.getStress()).toBe(0)
    })

    it('should emit gameOver when stress reaches 100', () => {
      gameState.addStress(100)
      expect(mockGame.events.emit).toHaveBeenCalledWith('gameOver', {
        reason: 'burnout',
      })
    })
  })

  describe('respect management', () => {
    it('should add respect correctly', () => {
      gameState.addRespect(15)
      expect(gameState.getRespect()).toBe(15)
      expect(mockGame.events.emit).toHaveBeenCalledWith('respectChanged', {
        old: 0,
        new: 15,
      })
    })

    it('should not exceed 100 respect', () => {
      gameState.addRespect(150)
      expect(gameState.getRespect()).toBe(100)
    })

    it('should reduce respect correctly', () => {
      gameState.addRespect(30)
      gameState.reduceRespect(10)
      expect(gameState.getRespect()).toBe(20)
    })

    it('should not go below 0 respect', () => {
      gameState.reduceRespect(10)
      expect(gameState.getRespect()).toBe(0)
    })
  })

  describe('career progression', () => {
    it('should not promote without enough respect', () => {
      expect(gameState.canPromote()).toBe(false)
    })

    it('should promote with enough respect', () => {
      gameState.addRespect(25)
      expect(gameState.canPromote()).toBe(true)
      expect(gameState.promote()).toBe(true)
      expect(gameState.getCareerLevel()).toBe('middle')
    })

    it('should not promote if stress is too high', () => {
      gameState.addRespect(25)
      gameState.addStress(70)
      expect(gameState.canPromote()).toBe(false)
    })
  })

  describe('game over', () => {
    it('should detect game over at 100 stress', () => {
      gameState.addStress(100)
      expect(gameState.isGameOver()).toBe(true)
    })

    it('should not detect game over below 100 stress', () => {
      gameState.addStress(99)
      expect(gameState.isGameOver()).toBe(false)
    })
  })
})
