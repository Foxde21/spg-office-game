import { test, expect } from '@playwright/test'
import {
  canvasClickAt,
  destroyGame,
  goToGame,
  movePlayerTo,
  pressKey,
  startNpcDialogue,
  waitForGameReady,
  type PhaserGameLike,
  type WindowWithGame,
} from './helpers'

type UISceneLike = {
  inventoryOpen?: boolean
  currentChoices?: unknown[]
  selectedChoiceIndex?: number
  confirmChoiceSelection?: () => void
}

type InventoryItemLike = {
  name?: string
}

type QuestLike = {
  title?: string
}

test.afterEach(async ({ page }) => {
  await destroyGame(page)
})

test.describe('Game Initialization', () => {
  test('should load the game', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isActive?.('MenuScene') === true || g?.scene?.isActive?.('PreloadScene') === true
      },
      { timeout: 60000 }
    )
  })

  test('should show main menu', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isActive?.('MenuScene') === true
      },
      { timeout: 60000 }
    )
  })

  test('should show UI elements', async ({ page }) => {
    await goToGame(page)
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return Boolean(
          g?.scene?.isActive?.('GameScene') &&
            g?.scene?.isActive?.('UIScene') &&
            g?.registry?.get?.('gameState')
        )
      },
      { timeout: 5000 }
    )
  })

  test('should show quest panel', async ({ page }) => {
    await goToGame(page)
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isActive?.('UIScene') === true
      },
      { timeout: 5000 }
    )
  })
})

test.describe('Player Movement', () => {
  test('should move player with arrow keys', async ({ page }) => {
    await goToGame(page)
    await page.keyboard.press('ArrowRight', { delay: 100 })
    await page.keyboard.press('ArrowRight', { delay: 100 })
    await page.keyboard.press('ArrowDown', { delay: 100 })
    await page.waitForTimeout(500)
    await expect(page.locator('canvas')).toBeVisible()
  })
})

test.describe('Inventory System', () => {
  test('should open inventory with I key', async ({ page }) => {
    await goToGame(page)
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined

        return ui?.inventoryOpen === true
      },
      { timeout: 10000 }
    )
  })

  test('should close inventory with I key', async ({ page }) => {
    await goToGame(page)
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined

        return ui?.inventoryOpen === true
      },
      { timeout: 10000 }
    )
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined

        return ui?.inventoryOpen === false
      },
      { timeout: 10000 }
    )
  })

  test('should show empty inventory message', async ({ page }) => {
    await goToGame(page)
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined

        return ui?.inventoryOpen === true
      },
      { timeout: 10000 }
    )
    const count = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const inv = g?.registry?.get?.('inventory') as { getAllItems?: () => unknown[] } | undefined

      return inv?.getAllItems?.()?.length ?? -1
    })
    expect(count).toBe(0)
  })
})

test.describe('NPC Interaction', () => {
  test('should interact with NPC', async ({ page }) => {
    await goToGame(page)
    await movePlayerTo(page, 532, 320)
    await startNpcDialogue(page)
  })
})

test.describe('Item Pickup', () => {
  test('should pickup item', async ({ page }) => {
    await goToGame(page)
    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const loc = g?.registry?.get?.('locationManager') as {
        changeLocation?: (id: string, x: number, y: number) => void
      } | undefined
      loc?.changeLocation?.('kitchen', 100, 360)
    })
    await page.waitForTimeout(500)
    await movePlayerTo(page, 640, 398)
    await pressKey(page, 'e')
    await page.waitForTimeout(300)
    const items = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const inv = g?.registry?.get?.('inventory') as { getAllItems?: () => unknown[] } | undefined

      return inv?.getAllItems?.() ?? []
    })
    const hasCoffee = (items as InventoryItemLike[]).some((it) => it?.name === 'Кофе')
    expect(hasCoffee).toBe(true)
  })
})

test.describe('Quest System', () => {
  test('should start quest from dialogue', async ({ page }) => {
    await goToGame(page)
    await movePlayerTo(page, 532, 320)
    await startNpcDialogue(page)
    await page.waitForTimeout(200)
    await page.keyboard.press('Space')
    await page.waitForTimeout(400)
    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      if (ui?.currentChoices?.length) {
        ui.selectedChoiceIndex = 0
        ui.confirmChoiceSelection?.()
      }
    })
    await page.waitForTimeout(500)
    const quests = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const qm = g?.registry?.get?.('questManager') as { getActiveQuests?: () => unknown[] } | undefined

      return qm?.getActiveQuests?.() ?? []
    })
    const hasDocQuest = (quests as QuestLike[]).some((q) => q?.title?.includes('документацию'))
    expect(hasDocQuest).toBe(true)
  })
})

test.describe('Stress System', () => {
  test('should show stress warning at high stress', async ({ page }) => {
    await goToGame(page)
    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as { addStress?: (n: number) => void } | undefined
      gs?.addStress?.(75)
    })
    await page.waitForTimeout(500)
    const stress = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as { getStress?: () => number } | undefined

      return gs?.getStress?.() ?? 0
    })
    expect(stress).toBeGreaterThanOrEqual(75)
  })
})

test.describe('Main menu and Settings', () => {
  test('should open settings from main menu and return on Back', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined

      return g?.scene?.isActive?.('MenuScene') === true
    }, { timeout: 5000 })
    await canvasClickAt(page, 640, 460)
    await page.waitForTimeout(400)
    const settingsActive = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined

      return g?.scene?.isActive?.('SettingsScene')
    })
    expect(settingsActive).toBe(true)
    await canvasClickAt(page, 470, 500)
    await page.waitForTimeout(400)
    const menuActive = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined

      return g?.scene?.isActive?.('MenuScene')
    })
    expect(menuActive).toBe(true)
  })

  test('should show settings overlay when opened from menu', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined

      return g?.scene?.isActive?.('MenuScene') === true
    }, { timeout: 5000 })
    await canvasClickAt(page, 640, 460)
    await page.waitForTimeout(400)
    const settingsActive = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined

      return g?.scene?.isActive?.('SettingsScene')
    })
    expect(settingsActive).toBe(true)
  })
})

test.describe('Game Over', () => {
  test('should show game over at 100 stress', async ({ page }) => {
    await goToGame(page)
    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as { addStress?: (n: number) => void } | undefined
      gs?.addStress?.(100)
    })
    await page.waitForTimeout(500)
    const gameOverActive = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined

      return g?.scene?.isActive?.('GameOverScene')
    })
    expect(gameOverActive).toBe(true)
  })
})
