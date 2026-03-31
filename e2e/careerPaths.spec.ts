import { test, expect } from '@playwright/test'
import {
  clearLocalStorage,
  destroyGame,
  goToGame,
  getDialogueText,
  movePlayerTo,
  pressSpaceToNextLine,
  selectChoiceByIncludes,
  startNpcDialogue,
  type PhaserGameLike,
  type WindowWithGame,
} from './helpers'

type GameStateLike = {
  addRespect?: (amount: number) => void
  reduceRespect?: (amount: number) => void
}

test.beforeEach(async ({ page }) => {
  await clearLocalStorage(page)
})

test.afterEach(async ({ page }) => {
  await destroyGame(page)
})

test.describe('Career paths scripted flow', () => {
  test('initial respect lines -> gain respect -> Petya career dialogue -> Tim lead reaction', async ({ page }) => {
    await goToGame(page)

    await movePlayerTo(page, 532, 320)
    await startNpcDialogue(page)

    let d = await getDialogueText(page)
    expect(d.speaker).toContain('Тим')
    expect(d.text).toContain('Привет, новенький')

    await pressSpaceToNextLine(page)
    d = await getDialogueText(page)
    expect(d.text).toContain('Твоя первая задача')

    await page.keyboard.press('Escape')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isPaused?.('GameScene') === false
      },
      { timeout: 10000 }
    )

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
      if (gs?.addRespect) gs.addRespect(25)
    })
    await page.waitForTimeout(200)

    await movePlayerTo(page, 760, 320)
    await startNpcDialogue(page)

    d = await getDialogueText(page)
    expect(d.speaker).toContain('Петя')
    expect(d.text).toMatch(/задумывался/i)

    await pressSpaceToNextLine(page)
    d = await getDialogueText(page)
    expect(d.text).toMatch(/ну\s+так\s+что/i)

    await selectChoiceByIncludes(page, 'AI')
    d = await getDialogueText(page)
    expect(d.text).toContain('AI')
    expect(d.text).toContain('отличный выбор')

    await page.keyboard.press('Escape')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isPaused?.('GameScene') === false
      },
      { timeout: 10000 }
    )

    await movePlayerTo(page, 532, 320)
    await startNpcDialogue(page)

    d = await getDialogueText(page)
    expect(d.speaker).toContain('Тим')
    expect(d.text).toContain('AI?')
    expect(d.text).toContain('Круто')
  })

  test('Petya does not start career dialogue when respect < 20', async ({ page }) => {
    await goToGame(page)

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
      if (gs?.reduceRespect) gs.reduceRespect(100)
    })
    await page.waitForTimeout(200)

    await movePlayerTo(page, 760, 320)
    await startNpcDialogue(page)

    const d = await getDialogueText(page)
    expect(d.speaker).toContain('Петя')
    expect(d.text).not.toMatch(/задумывался/i)
  })
})
