import Phaser from 'phaser'
import type { GameState, PlayerData } from '../types'
import { CAREER_LEVELS, type CareerLevel } from '../config'

export class GameStateManager {
  private static instance: GameStateManager
  private game: Phaser.Game
  private state: GameState

  private constructor(game: Phaser.Game) {
    this.game = game
    this.state = this.createInitialState()
  }

  static getInstance(game?: Phaser.Game): GameStateManager {
    if (!GameStateManager.instance && game) {
      GameStateManager.instance = new GameStateManager(game)
    }
    return GameStateManager.instance
  }

  private createInitialState(): GameState {
    return {
      player: {
        name: 'Player',
        careerLevel: 'junior',
        stress: 0,
        respect: 0,
        inventory: [],
        completedQuests: [],
        currentQuests: [],
      },
      npcs: {},
      flags: {},
    }
  }

  getState(): GameState {
    return this.state
  }

  getPlayer(): PlayerData {
    return this.state.player
  }

  getStress(): number {
    return this.state.player.stress
  }

  getRespect(): number {
    return this.state.player.respect
  }

  getCareerLevel(): CareerLevel {
    return this.state.player.careerLevel as CareerLevel
  }

  addStress(amount: number): void {
    const oldStress = this.state.player.stress
    this.state.player.stress = Math.min(100, Math.max(0, oldStress + amount))
    
    this.game.events.emit('stressChanged', {
      old: oldStress,
      new: this.state.player.stress,
    })

    if (this.state.player.stress >= 100) {
      this.game.events.emit('gameOver', { reason: 'burnout' })
    }
  }

  reduceStress(amount: number): void {
    this.addStress(-amount)
  }

  addRespect(amount: number): void {
    const oldRespect = this.state.player.respect
    this.state.player.respect = Math.min(100, Math.max(0, oldRespect + amount))
    
    this.game.events.emit('respectChanged', {
      old: oldRespect,
      new: this.state.player.respect,
    })
  }

  reduceRespect(amount: number): void {
    this.addRespect(-amount)
  }

  canPromote(): boolean {
    const currentLevel = this.getCareerLevel()
    const levelIndex = CAREER_LEVELS.findIndex((l) => l.id === currentLevel)
    
    if (levelIndex >= CAREER_LEVELS.length - 1) return false
    
    const nextLevel = CAREER_LEVELS[levelIndex + 1]
    return (
      this.state.player.respect >= nextLevel.respect &&
      this.state.player.stress < 70
    )
  }

  promote(): boolean {
    if (!this.canPromote()) return false

    const currentLevel = this.getCareerLevel()
    const levelIndex = CAREER_LEVELS.findIndex((l) => l.id === currentLevel)
    const nextLevel = CAREER_LEVELS[levelIndex + 1]

    this.state.player.careerLevel = nextLevel.id
    this.game.events.emit('careerLevelUp', { level: nextLevel.id })
    
    return true
  }

  isGameOver(): boolean {
    return this.state.player.stress >= 100
  }

  setPlayerName(name: string): void {
    this.state.player.name = name
  }

  setState(state: GameState): void {
    this.state = state
  }

  reset(): void {
    this.state = this.createInitialState()
  }
}
