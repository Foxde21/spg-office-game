import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('phaser', () => ({
  default: {
    Physics: {
      Arcade: {
        Sprite: class MockSprite {}
      }
    }
  }
}))

describe('NPC.getDialogue', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const createNpc = async (opts: {
    isAI?: boolean
    dialogues: any[]
    respect?: number
    careerPathChosen?: boolean
    careerPath?: string
  }) => {
    const mod = await import('../../src/objects/NPC')
    const NPCClass = mod.NPC as any

    const npc: any = Object.create(NPCClass.prototype)
    npc.npcId = 'tim-lead'
    npc.npcName = 'Тим Лид'
    npc.role = 'Senior Developer'
    npc.dialogues = opts.dialogues
    npc.isAI = Boolean(opts.isAI)

    const mockGameState = {
      getRespect: vi.fn().mockReturnValue(opts.respect ?? 0),
      getFlag: vi.fn((id: string) => {
        if (id === 'careerPathChosen') return Boolean(opts.careerPathChosen)

        return false
      }),
      getCareerPath: vi.fn().mockReturnValue(opts.careerPath)
    }

    npc.scene = {
      game: {
        registry: {
          get: vi.fn((key: string) => {
            if (key === 'gameState') return mockGameState

            return undefined
          })
        }
      }
    }

    return { npc, mockGameState }
  }

  it('returns AI descriptor when npc is AI', async () => {
    const { npc } = await createNpc({
      isAI: true,
      dialogues: [{ id: 'intro', lines: [] }]
    })

    expect(npc.getDialogue()).toEqual({ npcId: 'tim-lead', name: 'Тим Лид', isAI: true })
  })

  it('selects career-choice-* when respect >= 20 and careerPathChosen is false', async () => {
    const { npc } = await createNpc({
      isAI: false,
      respect: 25,
      careerPathChosen: false,
      dialogues: [
        { id: 'intro', lines: [] },
        { id: 'career-choice-ai', lines: [] }
      ]
    })

    const result = npc.getDialogue()
    expect(result.isAI).toBeUndefined()
    expect(result.startId).toBe('career-choice-ai')
  })

  it('selects career-react-<pathId> when careerPathChosen is true and reaction exists', async () => {
    const { npc } = await createNpc({
      isAI: false,
      respect: 25,
      careerPathChosen: true,
      careerPath: 'ai',
      dialogues: [
        { id: 'intro', lines: [] },
        { id: 'career-react-ai', lines: [] },
        { id: 'career-choice-ai', lines: [] }
      ]
    })

    const result = npc.getDialogue()
    expect(result.startId).toBe('career-react-ai')
  })

  it('falls back to first dialogue when no conditions match', async () => {
    const { npc } = await createNpc({
      isAI: false,
      respect: 10,
      careerPathChosen: false,
      dialogues: [{ id: 'intro', lines: [] }]
    })

    const result = npc.getDialogue()
    expect(result.startId).toBe('intro')
  })
})
