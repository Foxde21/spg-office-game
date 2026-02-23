import { test, expect } from '@playwright/test'

test.describe('Game Initialization', () => {
  test('should load the game', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('#game-container')).toBeVisible()
    
    await page.waitForTimeout(2000)
    
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('should show UI elements', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await expect(page.getByText('Уровень: Junior Developer')).toBeVisible()
    await expect(page.getByText('Стресс:')).toBeVisible()
    await expect(page.getByText('Уважение:')).toBeVisible()
    await expect(page.getByText('[I] Инвентарь')).toBeVisible()
  })

  test('should show quest panel', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await expect(page.getByText('📋 Активные квесты')).toBeVisible()
  })
})

test.describe('Player Movement', () => {
  test('should move player with arrow keys', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await page.keyboard.press('ArrowRight', { delay: 100 })
    await page.keyboard.press('ArrowRight', { delay: 100 })
    await page.keyboard.press('ArrowDown', { delay: 100 })
    
    await page.waitForTimeout(500)
    
    await expect(page.locator('canvas')).toBeVisible()
  })
})

test.describe('Inventory System', () => {
  test('should open inventory with I key', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await page.keyboard.press('i')
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Инвентарь')).toBeVisible()
    await expect(page.getByText('[I] Закрыть')).toBeVisible()
  })

  test('should close inventory with I key', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await page.keyboard.press('i')
    await page.waitForTimeout(500)
    await expect(page.getByText('Инвентарь')).toBeVisible()
    
    await page.keyboard.press('i')
    await page.waitForTimeout(500)
    
    await expect(page.getByText('[I] Закрыть')).not.toBeVisible()
  })

  test('should show empty inventory message', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await page.keyboard.press('i')
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Инвентарь пуст')).toBeVisible()
  })
})

test.describe('NPC Interaction', () => {
  test('should interact with NPC', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('ArrowRight', { delay: 50 })
    }
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowUp', { delay: 50 })
    }
    
    await page.waitForTimeout(500)
    
    await page.keyboard.press('e')
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Тим Лид')).toBeVisible()
    await expect(page.getByText('Привет, новенький!')).toBeVisible()
  })
})

test.describe('Item Pickup', () => {
  test('should pickup item', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('ArrowRight', { delay: 50 })
    }
    
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowDown', { delay: 50 })
    }
    
    await page.waitForTimeout(500)
    
    await page.keyboard.press('e')
    await page.waitForTimeout(500)
    
    await page.keyboard.press('i')
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Кофе')).toBeVisible()
  })
})

test.describe('Quest System', () => {
  test('should start quest from dialogue', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('ArrowRight', { delay: 50 })
    }
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowUp', { delay: 50 })
    }
    
    await page.waitForTimeout(500)
    
    await page.keyboard.press('e')
    await page.waitForTimeout(500)
    
    await page.getByText('▸ Понял, иду искать!').click()
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Найти документацию')).toBeVisible()
  })
})

test.describe('Stress System', () => {
  test('should show stress warning at high stress', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await page.evaluate(() => {
      const game = (window as any).game
      if (game) {
        const gameState = game.registry.get('gameState')
        if (gameState) {
          gameState.addStress(75)
        }
      }
    })
    
    await page.waitForTimeout(500)
    
    await expect(page.getByText('⚠️')).toBeVisible()
  })
})

test.describe('Game Over', () => {
  test('should show game over at 100 stress', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    await page.evaluate(() => {
      const game = (window as any).game
      if (game) {
        const gameState = game.registry.get('gameState')
        if (gameState) {
          gameState.addStress(100)
        }
      }
    })
    
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Вы выгорели и уволились...')).toBeVisible()
  })
})
