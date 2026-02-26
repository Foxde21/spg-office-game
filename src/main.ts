import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { PreloadScene } from './scenes/PreloadScene'
import { MenuScene } from './scenes/MenuScene'
import { SettingsScene } from './scenes/SettingsScene'
import { PauseScene } from './scenes/PauseScene'
import { GameOverScene } from './scenes/GameOverScene'
import { VictoryScene } from './scenes/VictoryScene'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'
import { GameStateManager } from './managers/GameState'
import { InventoryManager } from './managers/Inventory'
import { QuestManager } from './managers/Quest'
import { LocationManager } from './managers/LocationManager'
import { SaveManager } from './managers/Save'

const config: Phaser.Types.Core.GameConfig = {
  type: typeof window !== 'undefined' && (window as any).USE_CANVAS_RENDERER ? Phaser.CANVAS : Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#2d2d44',
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, MenuScene, SettingsScene, PauseScene, GameOverScene, VictoryScene, GameScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

const game = new Phaser.Game(config)
if (typeof window !== 'undefined') (window as any).game = game
const gameState = GameStateManager.getInstance(game)
const inventory = InventoryManager.getInstance(game)
const questManager = QuestManager.getInstance(game)
const locationManager = LocationManager.getInstance(game)
SaveManager.getInstance(game)
if (typeof game.registry !== 'undefined') {
  game.registry.set('gameState', gameState)
  game.registry.set('inventory', inventory)
  game.registry.set('questManager', questManager)
  game.registry.set('locationManager', locationManager)
}
