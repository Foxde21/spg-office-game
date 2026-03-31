import { test, expect } from '@playwright/test'
import { destroyGame, goToGame, type PhaserGameLike, type WindowWithGame } from './helpers'

test.afterEach(async ({ page }) => {
  await destroyGame(page)
})

test.describe('Toasts', () => {
  test('should show success toast on careerLevelUp', async ({ page }) => {
    await goToGame(page)

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      ;(g as unknown as { events?: { emit?: (event: string, payload: unknown) => void } })?.events?.emit?.(
        'careerLevelUp',
        { level: 'middle' }
      )
    })

    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as { activeToasts?: Map<string, { text?: string }> } | undefined

      const toast = ui?.activeToasts?.get('success')

      return Boolean(toast?.text && toast.text.includes('Повышение!'))
    }, { timeout: 10000 })

    const text = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as { activeToasts?: Map<string, { text?: string }> } | undefined

      return ui?.activeToasts?.get('success')?.text ?? ''
    })

    expect(text).toContain('Повышение!')
  })
})
