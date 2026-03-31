import { test, expect, type Page } from '@playwright/test'

import {
  clearLocalStorage,
  destroyGame,
  getDialogueText,
  goToGame,
  movePlayerTo,
  pressSpaceToNextLine,
  selectChoiceByIncludes,
  startNpcDialogue,
  type PhaserGameLike,
  type WindowWithGame
} from './helpers'

type DialogueLike = {
  id?: string
}

type DialogueChoiceLike = {
  text?: string
}

type AssessmentQuestionLike = {
  choices?: Array<{ score?: number }>
}

type UISceneLike = {
  currentDialogue?: DialogueLike | null
  currentChoices?: DialogueChoiceLike[]
  selectedChoiceIndex?: number
  confirmChoiceSelection?: () => void
  showAssessmentDomainSelect?: (shouldQueue: boolean) => void
  startAssessment?: (domainId: string, questionCount?: number) => void
  scriptedNpc?: unknown
  activeAssessment?: {
    currentIndex?: number
    questions?: AssessmentQuestionLike[]
  }
}

type GameStateLike = {
  addRespect?: (amount: number) => void
  setFlag?: (id: string, value: boolean) => void
  setCareerPath?: (id: string) => void
  reduceStress?: (amount: number) => void
}

type AssessmentStateLike = {
  careerPathProgress?: {
    currentLevel?: string
    domainProgress: Record<string, { score: number; answeredQuestions: string[] }>
  }
}

type AssessmentManagerLike = {
  setCareerPath?: (id: string) => void
  getCareerPathId?: () => string | null
  getAssessmentState?: () => AssessmentStateLike
  loadState?: (state: AssessmentStateLike) => void
  getCurrentLevel?: () => { id: string } | null
  getAvailableDomains?: () => Array<{ id: string }>
  getDomainProgress?: (domainId: string) => { score: number } | null
  getNextQuestion?: (domainId: string) => { id: string; choices: Array<{ id: string; score: number }> } | null
  submitAnswer?: (questionId: string, choiceId: string) => void
  resetDomainProgress?: (domainId: string) => boolean
}

test.beforeEach(async ({ page }) => {
  await clearLocalStorage(page)
})

test.afterEach(async ({ page }) => {
  await destroyGame(page)
})

test.describe('Assessment flow (AI)', () => {
  async function runThreeQuestionModule(page: Page) {
    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      const id = String(ui?.currentDialogue?.id ?? '')
      return id.startsWith('assessment-question-') || id === 'assessment-summary'
    })

    const maxSteps = 20
    for (let step = 0; step < maxSteps; step++) {
      const state = await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        const id = String(ui?.currentDialogue?.id ?? '')

        return { id }
      })

      if (state.id === 'assessment-summary') {
        return
      }

      if (state.id.startsWith('assessment-question-')) {
        await page.evaluate(() => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const rawUi = g?.scene?.getScene?.('UIScene') as unknown
          if (!rawUi) return
          const ui = rawUi as UISceneLike

          const q = ui.activeAssessment?.questions?.[ui.activeAssessment?.currentIndex ?? 0]
          const idx = q?.choices?.length
            ? q.choices.reduce(
                (bestIdx: number, c: any, j: number, arr: any[]) =>
                  c?.score > (arr?.[bestIdx]?.score ?? -1) ? j : bestIdx,
                0
              )
            : 0

          if ((ui.currentChoices ?? []).length) {
            ui.selectedChoiceIndex = idx
            ui.confirmChoiceSelection?.()
          }
        })

        await page.waitForTimeout(150)
        await page.evaluate(() => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
          if (gs?.reduceStress) gs.reduceStress(1000)
        })

        await page.waitForFunction(() => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
          const id = String(ui?.currentDialogue?.id ?? '')
          return id.startsWith('assessment-feedback-') || id === 'assessment-summary'
        })

        continue
      }

      if (state.id.startsWith('assessment-feedback-')) {
        await page.evaluate(() => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const rawUi = g?.scene?.getScene?.('UIScene') as unknown
          if (!rawUi) return
          const ui = rawUi as UISceneLike
          if ((ui.currentChoices ?? []).length) {
            ui.selectedChoiceIndex = 0
            ui.confirmChoiceSelection?.()
          }
        })

        await page.waitForTimeout(150)
        await page.evaluate(() => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
          if (gs?.reduceStress) gs.reduceStress(1000)
        })

        await page.waitForFunction(() => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
          const id = String(ui?.currentDialogue?.id ?? '')
          return id.startsWith('assessment-question-') || id === 'assessment-summary'
        })

        continue
      }

      await page.waitForTimeout(150)
    }

    const debug = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      const choices = (ui?.currentChoices ?? []).map((c) => String(c?.text ?? ''))
      return {
        currentDialogueId: String(ui?.currentDialogue?.id ?? ''),
        choices,
      }
    })

    const debugStr = JSON.stringify(debug)

    throw new Error(`Assessment module did not reach summary. Current state: ${debugStr}`)
  }

  test('starts assessment via Petya and shows summary after answering', async ({ page }) => {
    await goToGame(page)

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
      if (gs?.addRespect) gs.addRespect(25)
      if (gs?.setFlag) gs.setFlag('careerPathChosen', true)
      if (gs?.setCareerPath) gs.setCareerPath('ai')
      if (gs?.reduceStress) gs.reduceStress(1000)

      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      if (am?.setCareerPath) am.setCareerPath('ai')
    })

    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      return typeof am?.getCareerPathId === 'function' ? Boolean(am.getCareerPathId()) : Boolean(am)
    })

    await movePlayerTo(page, 760, 320)
    await startNpcDialogue(page)

    await pressSpaceToNextLine(page, 1)
    await selectChoiceByIncludes(page, 'Давай')

    const d = await getDialogueText(page)
    expect(d.text).toMatch(/теме\s+хочешь|выбери\s+тему/i)

    await selectChoiceByIncludes(page, 'Основы')

    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      return String(ui?.currentDialogue?.id ?? '').startsWith('assessment-question-')
    })

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const rawUi = g?.scene?.getScene?.('UIScene') as unknown
        if (!rawUi) return
        const ui = rawUi as UISceneLike

        const q = ui.activeAssessment?.questions?.[ui.activeAssessment?.currentIndex ?? 0]
        const idx = q?.choices?.length
          ? q.choices.reduce(
              (bestIdx: number, c: any, j: number, arr: any[]) =>
                c?.score > (arr?.[bestIdx]?.score ?? -1) ? j : bestIdx,
              0
            )
          : 0

        if (ui.currentChoices?.length) {
          ui.selectedChoiceIndex = idx
          ui.confirmChoiceSelection?.()
        }
      })
      await page.waitForTimeout(300)

      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const rawUi = g?.scene?.getScene?.('UIScene') as unknown
        if (!rawUi) return
        const ui = rawUi as UISceneLike

        const idx = (ui.currentChoices ?? []).findIndex((c: any) =>
          String(c?.text ?? '').toLowerCase().includes('следующий') ||
          String(c?.text ?? '').toLowerCase().includes('итог')
        )
        if (idx >= 0) {
          ui.selectedChoiceIndex = idx
          ui.confirmChoiceSelection?.()
        }
      })
      await page.waitForTimeout(300)
    }

    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      return String(ui?.currentDialogue?.id ?? '') === 'assessment-summary'
    })

    const summary = await getDialogueText(page)
    expect(summary.text).toContain('Твой результат по ассессменту')
  })

  test('promotes only at the end of module and only by one level', async ({ page }) => {
    await goToGame(page)

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
      if (gs?.addRespect) gs.addRespect(25)
      if (gs?.setFlag) gs.setFlag('careerPathChosen', true)
      if (gs?.setCareerPath) gs.setCareerPath('ai')

      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      if (!am?.getAssessmentState || !am?.loadState) return

      if (am?.setCareerPath) {
        am.setCareerPath('ai')
      }

      const state = am.getAssessmentState()
      const progress = state?.careerPathProgress
      if (!progress) return

      progress.currentLevel = 'ai-junior'

      const setDomain = (id: string, score: number) => {
        const d = progress.domainProgress[id]
        if (!d) return
        d.score = score
        d.answeredQuestions = [`${id}-q1`]
      }

      setDomain('ml-fundamentals', 80)
      setDomain('data-engineering', 80)

      am.loadState(state)
    })

    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      return typeof am?.getCurrentLevel === 'function' && Boolean(am.getCurrentLevel()?.id)
    })

    await page.waitForTimeout(200)

    await movePlayerTo(page, 760, 320)
    await startNpcDialogue(page)
    await pressSpaceToNextLine(page, 1)
    await selectChoiceByIncludes(page, 'Давай')
    await selectChoiceByIncludes(page, 'Основы')

    const midBefore = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined

      return am?.getCurrentLevel?.()?.id
    })
    expect(midBefore).toBe('ai-junior')

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        if (!ui) return

        const q = ui?.activeAssessment?.questions?.[ui?.activeAssessment?.currentIndex ?? 0]
        const idx = q?.choices?.length
          ? q.choices.reduce(
              (bestIdx: number, c: any, j: number, arr: any[]) =>
                c?.score > (arr?.[bestIdx]?.score ?? -1) ? j : bestIdx,
              0
            )
          : 0

        if (ui?.currentChoices?.length) {
          ui.selectedChoiceIndex = idx
          ui.confirmChoiceSelection?.()
        }
      })
      await page.waitForTimeout(300)

      const levelAfterAnswer = await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined

        return am?.getCurrentLevel?.()?.id
      })
      expect(levelAfterAnswer).toBe('ai-junior')

      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        if (!ui) return

        const idx = (ui?.currentChoices ?? []).findIndex((c: any) =>
          String(c?.text ?? '').toLowerCase().includes('следующий') ||
          String(c?.text ?? '').toLowerCase().includes('итог')
        )
        if (idx >= 0) {
          ui.selectedChoiceIndex = idx
          ui.confirmChoiceSelection?.()
        }
      })
      await page.waitForTimeout(300)
    }

    await page.waitForTimeout(250)

    const levelAfter = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined

      return am?.getCurrentLevel?.()?.id
    })

    expect(levelAfter).toBe('ai-middle')

    const summary = await getDialogueText(page)
    expect(summary.text).toContain('вырос в грейде')
    expect(summary.text).toContain('AI Middle')
  })

  test('resetDomainProgress resets score and allows repeating questions', async ({ page }) => {
    await goToGame(page)

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
      if (gs?.setCareerPath) gs.setCareerPath('ai')
      if (gs?.setFlag) gs.setFlag('careerPathChosen', true)

      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      if (!am) return

      am.setCareerPath?.('ai')

      const q = am.getNextQuestion?.('ml-fundamentals')
      if (!q) return

      const best = q.choices.reduce((b: any, c: any) => (c.score > b.score ? c : b), q.choices[0])
      am.submitAnswer?.(q.id, best.id)

      const before = am.getDomainProgress?.('ml-fundamentals')?.score ?? -1
      if (before >= 0) {
        am.resetDomainProgress?.('ml-fundamentals')
      }
    })

    const result = await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      const score = am?.getDomainProgress?.('ml-fundamentals')?.score ?? -1
      const q = am?.getNextQuestion?.('ml-fundamentals')
      return { score, qid: q?.id ?? null }
    })

    expect(result.score).toBe(0)
    expect(result.qid).toBeTruthy()
  })

  test('full AI path: ai-junior -> ai-middle -> ai-senior -> ai-architect', async ({ page }) => {
    test.setTimeout(180000)
    await goToGame(page)

    const getCurrentLevelId = async (): Promise<string | null> => {
      return await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined

        return am?.getCurrentLevel?.()?.id ?? null
      })
    }

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
      if (gs?.addRespect) gs.addRespect(25)
      if (gs?.setFlag) gs.setFlag('careerPathChosen', true)
      if (gs?.setCareerPath) gs.setCareerPath('ai')
      if (gs?.reduceStress) gs.reduceStress(1000)

      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      if (am?.setCareerPath) am.setCareerPath('ai')
    })

    await page.waitForFunction(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
      return typeof am?.getAssessmentState === 'function' && typeof am?.loadState === 'function'
    })

    const openAssessment = async () => {
      await movePlayerTo(page, 760, 320)
      await startNpcDialogue(page)
      await pressSpaceToNextLine(page, 1)

      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const gs = g?.registry?.get?.('gameState') as GameStateLike | undefined
        if (gs?.reduceStress) gs.reduceStress(1000)
      })

      await page.waitForFunction(
        () => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
          return Boolean(ui?.scriptedNpc)
        },
        { timeout: 10000 }
      )

      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        ui?.showAssessmentDomainSelect?.(true)
      })

      await page.waitForFunction(
        () => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
          return String(ui?.currentDialogue?.id ?? '') === 'assessment-domain-select'
        },
        { timeout: 15000 }
      )

      await page.evaluate(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
        const domains = am?.getAvailableDomains?.() ?? []
        const firstId = domains?.[0]?.id
        if (firstId && typeof ui?.startAssessment === 'function') {
          ui.startAssessment(firstId, 3)

          return
        }

        if (ui?.currentChoices?.length) {
          ui.selectedChoiceIndex = 0
          ui.confirmChoiceSelection?.()
        }
      })

      await page.waitForFunction(() => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        return String(ui?.currentDialogue?.id ?? '').startsWith('assessment-question-')
      })
    }

    const setProgressForNext = async (currentLevel: string, domainIds: string[], score: number) => {
      await page.evaluate(
        ({ currentLevel, domainIds, score }) => {
          const w = window as unknown as WindowWithGame
          const g = w.game as PhaserGameLike | undefined
          const am = g?.registry?.get?.('assessmentManager') as AssessmentManagerLike | undefined
          if (!am?.getAssessmentState || !am?.loadState) return
          const state = am.getAssessmentState()
          const progress = state?.careerPathProgress
          if (!progress) return

          progress.currentLevel = currentLevel

          for (const id of domainIds) {
            const d = progress.domainProgress[id]
            if (!d) continue
            d.score = score
            d.answeredQuestions = [`${id}-q1`]
          }

          am.loadState(state)
        },
        { currentLevel, domainIds, score }
      )
      await page.waitForTimeout(150)
    }

    await setProgressForNext('ai-junior', ['ml-fundamentals', 'data-engineering'], 100)
    await openAssessment()

    const levelBefore1 = await getCurrentLevelId()
    expect(levelBefore1).toBe('ai-junior')

    await runThreeQuestionModule(page)

    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        return String(ui?.currentDialogue?.id ?? '') === 'assessment-summary'
      },
      { timeout: 20000 }
    )

    const levelAfter1 = await getCurrentLevelId()
    expect(levelAfter1).toBe('ai-middle')

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      if (!ui) return
      const idx = (ui?.currentChoices ?? []).findIndex((c) => String(c?.text ?? '').includes('Ок'))
      if (idx >= 0) {
        ui.selectedChoiceIndex = idx
        ui.confirmChoiceSelection?.()
      }
    })
    await page.waitForTimeout(300)

    await page.keyboard.press('Escape')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isPaused?.('GameScene') === false
      },
      { timeout: 10000 }
    )

    await setProgressForNext(
      'ai-middle',
      ['ml-fundamentals', 'data-engineering', 'deep-learning', 'nlp-llms'],
      100
    )
    await openAssessment()
    await runThreeQuestionModule(page)

    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        return String(ui?.currentDialogue?.id ?? '') === 'assessment-summary'
      },
      { timeout: 20000 }
    )

    const levelAfter2 = await getCurrentLevelId()
    expect(levelAfter2).toBe('ai-senior')

    await page.evaluate(() => {
      const w = window as unknown as WindowWithGame
      const g = w.game as PhaserGameLike | undefined
      const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
      if (!ui) return

      const idx = (ui?.currentChoices ?? []).findIndex((c) => String(c?.text ?? '').includes('Ок'))
      if (idx >= 0) {
        ui.selectedChoiceIndex = idx
        ui.confirmChoiceSelection?.()
      }
    })
    await page.waitForTimeout(300)

    await page.keyboard.press('Escape')
    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined

        return g?.scene?.isPaused?.('GameScene') === false
      },
      { timeout: 10000 }
    )

    await setProgressForNext(
      'ai-senior',
      [
        'ml-fundamentals',
        'data-engineering',
        'deep-learning',
        'nlp-llms',
        'mlops',
        'system-design'
      ],
      100
    )
    await openAssessment()
    await runThreeQuestionModule(page)

    await page.waitForFunction(
      () => {
        const w = window as unknown as WindowWithGame
        const g = w.game as PhaserGameLike | undefined
        const ui = g?.scene?.getScene?.('UIScene') as UISceneLike | undefined
        return String(ui?.currentDialogue?.id ?? '') === 'assessment-summary'
      },
      { timeout: 20000 }
    )

    const levelAfter3 = await getCurrentLevelId()
    expect(levelAfter3).toBe('ai-architect')
  })
})
