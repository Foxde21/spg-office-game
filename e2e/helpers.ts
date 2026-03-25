import { expect, type Page } from '@playwright/test'

export type WindowWithGame = {
  game?: unknown
}

export type PhaserGameLike = {
  destroy?: (removeCanvas?: boolean) => void
  scene?: {
    start?: (key: string) => void
    isActive?: (key: string) => boolean
    isPaused?: (key: string) => boolean
    getScene?: (key: string) => unknown
  }
  registry?: {
    get?: (key: string) => unknown
  }
}

export async function clearLocalStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.clear()
  })
}

export async function destroyGame(page: Page) {
  await page
    .evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      if (g && typeof g.destroy === 'function') g.destroy(true)
    })
    .catch(() => {})
}

export async function waitForGameReady(page: Page) {
  await page.goto('/?e2e=1', { waitUntil: 'load' })
  await page.waitForFunction(() => {
    const w = window as unknown as WindowWithGame

    return w.game != null
  }, { timeout: 45000 })
  await expect(page.locator('#game-container')).toBeVisible({ timeout: 5000 })
  await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(1000)
}

export async function goToGame(page: Page) {
  await waitForGameReady(page)
  await page.waitForFunction(() => {
    const w = window as unknown as WindowWithGame
    const g = w.game as PhaserGameLike | undefined

    return g?.scene?.isActive?.('MenuScene') === true
  }, {
    timeout: 30000
  })
  await page.evaluate(() => {
    const w = window as unknown as WindowWithGame
    const g = w.game as PhaserGameLike | undefined
    if (g?.scene?.start) g.scene.start('GameScene')
  })
  await page.waitForFunction(() => {
    const w = window as unknown as WindowWithGame
    const g = w.game as PhaserGameLike | undefined

    return g?.scene?.isActive?.('GameScene') === true
  }, {
    timeout: 15000
  })
  await page.waitForFunction(() => {
    const w = window as unknown as WindowWithGame
    const g = w.game as PhaserGameLike | undefined

    return g?.scene?.isActive?.('UIScene') === true
  }, {
    timeout: 10000
  })
  await page.waitForTimeout(800)

  await clickCanvas(page)
}

export async function clickCanvas(page: Page) {
  const pos = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  })
  if (pos) await page.mouse.click(pos.x, pos.y)
}

export async function canvasClickAt(page: Page, gameX: number, gameY: number) {
  const pos = await page.evaluate(
    ({ x, y }) => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const scaleX = rect.width / 1280
      const scaleY = rect.height / 720
      return { x: rect.left + x * scaleX, y: rect.top + y * scaleY }
    },
    { x: gameX, y: gameY }
  )
  if (pos) await page.mouse.click(pos.x, pos.y)
}

export async function movePlayerTo(page: Page, x: number, y: number) {
  await page.evaluate(
    ({ x, y }) => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const scene = g?.scene?.getScene?.('GameScene') as { player?: unknown } | undefined
      const player = scene?.player as { x: number; y: number } | undefined
      if (player) {
        player.x = x
        player.y = y
      }
    },
    { x, y }
  )
  await page.waitForTimeout(250)
}

export async function pressKey(page: Page, key: string, holdMs = 80) {
  await clickCanvas(page)
  await page.keyboard.down(key)
  await page.waitForTimeout(holdMs)
  await page.keyboard.up(key)
}

export async function startNpcDialogue(page: Page) {
  await pressKey(page, 'e')
  await page.waitForFunction(() => {
    const w = window as unknown as WindowWithGame
    const g = w.game as PhaserGameLike | undefined

    return g?.scene?.isPaused?.('GameScene') === true
  }, {
    timeout: 10000
  })
  await page.waitForTimeout(250)
}

export async function getDialogueText(page: Page) {
  return await page.evaluate(() => {
    const w = window as unknown as WindowWithGame
    const g = w.game as PhaserGameLike | undefined
    const ui = g?.scene?.getScene?.('UIScene') as {
      speakerText?: { text?: string }
      dialogueText?: { text?: string }
    } | undefined

    return {
      speaker: ui?.speakerText?.text ?? '',
      text: ui?.dialogueText?.text ?? ''
    }
  })
}

export async function pressSpaceToNextLine(page: Page, times = 1) {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press('Space')
    await page.waitForTimeout(250)
  }
}

export async function selectChoiceByIncludes(page: Page, includes: string) {
  await page.evaluate(
    ({ includes }) => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as {
        currentChoices?: Array<{ text?: string }>
        selectedChoiceIndex?: number
        confirmChoiceSelection?: () => void
      } | undefined

      const idx = (ui?.currentChoices ?? []).findIndex((c) =>
        String(c?.text ?? '').includes(includes)
      )
      if (ui && idx >= 0) {
        ui.selectedChoiceIndex = idx
        ui.confirmChoiceSelection?.()
      }
    },
    { includes }
  )
  await page.waitForTimeout(350)
}
