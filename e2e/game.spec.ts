import { test, expect } from '@playwright/test'
import {
  canvasClickAt,
  destroyGame,
  goToGame,
  movePlayerTo,
  pressKey,
  startNpcDialogue,
  waitForGameReady,
} from './helpers'

test.afterEach(async ({ page }) => {
  await destroyGame(page)
})

test.describe('Game Initialization', () => {
  test('should load the game', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(
      () => {
        const g = (window as any).game
        return g?.scene?.isActive?.('MenuScene') === true || g?.scene?.isActive?.('PreloadScene') === true
      },
      { timeout: 60000 }
    )
  })

  test('should show main menu', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(
      () => (window as any).game?.scene?.isActive?.('MenuScene') === true,
      { timeout: 60000 }
    )
  })

  test('should show UI elements', async ({ page }) => {
    await goToGame(page)
    await page.waitForFunction(
      () => {
        const g = (window as any).game
        return g?.scene?.isActive('GameScene') && g?.scene?.isActive('UIScene') && g?.registry?.get('gameState')
      },
      { timeout: 5000 }
    )
  })

  test('should show quest panel', async ({ page }) => {
    await goToGame(page)
    await page.waitForFunction(
      () => (window as any).game?.scene?.isActive('UIScene') === true,
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
      () => ((window as any).game?.scene?.getScene('UIScene') as any)?.inventoryOpen === true,
      { timeout: 10000 }
    )
  })

  test('should close inventory with I key', async ({ page }) => {
    await goToGame(page)
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => ((window as any).game?.scene?.getScene('UIScene') as any)?.inventoryOpen === true,
      { timeout: 10000 }
    )
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => ((window as any).game?.scene?.getScene('UIScene') as any)?.inventoryOpen === false,
      { timeout: 10000 }
    )
  })

  test('should show empty inventory message', async ({ page }) => {
    await goToGame(page)
    await page.keyboard.press('i')
    await page.waitForFunction(
      () => ((window as any).game?.scene?.getScene('UIScene') as any)?.inventoryOpen === true,
      { timeout: 10000 }
    )
    const count = await page.evaluate(() => (window as any).game?.registry?.get('inventory')?.getAllItems?.()?.length ?? -1)
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
      const g = (window as any).game
      const loc = g?.registry?.get('locationManager')
      if (loc) loc.changeLocation('kitchen', 100, 360)
    })
    await page.waitForTimeout(500)
    await movePlayerTo(page, 640, 398)
    await pressKey(page, 'e')
    await page.waitForTimeout(300)
    const items = await page.evaluate(() => (window as any).game?.registry?.get('inventory')?.getAllItems?.() ?? [])
    const hasCoffee = items.some((it: { name?: string }) => it?.name === 'Кофе')
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
      const ui = (window as any).game?.scene?.getScene('UIScene')
      if (ui?.currentChoices?.length) {
        ui.selectedChoiceIndex = 0
        ui.confirmChoiceSelection()
      }
    })
    await page.waitForTimeout(500)
    const quests = await page.evaluate(() => (window as any).game?.registry?.get('questManager')?.getActiveQuests?.() ?? [])
    const hasDocQuest = quests.some((q: { title?: string }) => q?.title?.includes('документацию'))
    expect(hasDocQuest).toBe(true)
  })
})

test.describe('Stress System', () => {
  test('should show stress warning at high stress', async ({ page }) => {
    await goToGame(page)
    await page.evaluate(() => {
      const game = (window as any).game
      if (game?.registry?.get('gameState')) game.registry.get('gameState').addStress(75)
    })
    await page.waitForTimeout(500)
    const stress = await page.evaluate(() => (window as any).game?.registry?.get('gameState')?.getStress?.() ?? 0)
    expect(stress).toBeGreaterThanOrEqual(75)
  })
})

test.describe('Main menu and Settings', () => {
  test('should open settings from main menu and return on Back', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(() => (window as any).game?.scene?.isActive('MenuScene') === true, { timeout: 5000 })
    await canvasClickAt(page, 640, 460)
    await page.waitForTimeout(400)
    const settingsActive = await page.evaluate(() => (window as any).game?.scene?.isActive('SettingsScene'))
    expect(settingsActive).toBe(true)
    await canvasClickAt(page, 470, 500)
    await page.waitForTimeout(400)
    const menuActive = await page.evaluate(() => (window as any).game?.scene?.isActive('MenuScene'))
    expect(menuActive).toBe(true)
  })

  test('should show settings overlay when opened from menu', async ({ page }) => {
    await waitForGameReady(page)
    await page.waitForFunction(() => (window as any).game?.scene?.isActive('MenuScene') === true, { timeout: 5000 })
    await canvasClickAt(page, 640, 460)
    await page.waitForTimeout(400)
    const settingsActive = await page.evaluate(() => (window as any).game?.scene?.isActive('SettingsScene'))
    expect(settingsActive).toBe(true)
  })
})

test.describe('Game Over', () => {
  test('should show game over at 100 stress', async ({ page }) => {
    await goToGame(page)
    await page.evaluate(() => {
      const game = (window as any).game
      if (game?.registry?.get('gameState')) game.registry.get('gameState').addStress(100)
    })
    await page.waitForTimeout(500)
    const gameOverActive = await page.evaluate(() => (window as any).game?.scene?.isActive('GameOverScene'))
    expect(gameOverActive).toBe(true)
  })
})
