import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { PreloadScene } from './scenes/PreloadScene'
import { MenuScene } from './scenes/MenuScene'
import { MenuSceneV2 } from './scenes/MenuSceneV2'
import { UIScene } from './scenes/UIScene'
import { GameStateManager } from './managers/GameState'
import { InventoryManager } from './managers/Inventory'
import { QuestManager } from './managers/Quest'
import { LocationManager } from './managers/LocationManager'
import { SaveManager } from './managers/Save'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
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
  scene: [BootScene, PreloadScene, MenuScene, GameScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

const game = new Phaser.Game(config)
GameStateManager.getInstance(game)
InventoryManager.getInstance(game)
QuestManager.getInstance(game)
LocationManager.getInstance(game)
SaveManager.getInstance(game)
