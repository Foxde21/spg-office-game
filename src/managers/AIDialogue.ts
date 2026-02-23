import { NPC_PERSONALITIES } from '../data/npcPrompts'
import type { AIContext, AIResponse, NPCPersonality } from '../types/ai'

const API_URL = 'http://localhost:3001/api/ai/chat'

export class AIDialogueManager {
  private static instance: AIDialogueManager

  private constructor() {}

  static getInstance(): AIDialogueManager {
    if (!AIDialogueManager.instance) {
      AIDialogueManager.instance = new AIDialogueManager()
    }
    return AIDialogueManager.instance
  }

  private buildSystemPrompt(
    personality: NPCPersonality,
    context: AIContext
  ): string {
    const careerTitles: Record<string, string> = {
      junior: 'Junior Developer',
      middle: 'Middle Developer',
      senior: 'Senior Developer',
      lead: 'Team Lead'
    }

    const stressLevel = context.stress > 70 ? 'очень стрессован' : 
                        context.stress > 40 ? 'немного уставший' : 'спокоен'

    const respectLevel = context.respect > 70 ? 'высокое уважение в команде' :
                         context.respect > 40 ? 'среднее уважение' : 'новичок в команде'

    const relationshipDesc = context.relationship > 50 ? 'хорошо относитесь к игроку' :
                             context.relationship > 0 ? 'нейтрально относитесь к игроку' :
                             'скептически относитесь к игроку'

    return `Ты — ${personality.name}, ${personality.role} в IT-компании.

## Твой характер
${personality.personality}

## Твой стиль речи
${personality.speechStyle}

## Отношение к игроку
Ты ${relationshipDesc}. ${personality.relationshipWithPlayer}.

## Контекст разговора
Игрок: ${context.playerName}, ${careerTitles[context.careerLevel] || context.careerLevel}
Состояние игрока: ${stressLevel}, ${respectLevel}
История разговора: ${context.conversationHistory.length > 0 ? 'продолжение диалога' : 'начало разговора'}

## Правила
1. Отвечай кратко, 1-3 предложения
2. Говори от первого лица как ${personality.name}
3. Сохраняй характер и стиль речи
4. Реагируй на контекст (уровень стресса игрока, уважение, отношения)
5. Если игрок спрашивает о работе — ${personality.goals.join(', ')}
6. Возможные темы: ${personality.topics.join(', ')}
7. НЕ используй markdown, эмодзи или списки — только обычный текст
8. Будь живым и естественным

Отвечай на сообщение игрока.`
  }

  async generateResponse(
    playerMessage: string,
    context: AIContext
  ): Promise<AIResponse> {
    const personality = NPC_PERSONALITIES[context.npcId]
    
    if (!personality) {
      console.warn(`No personality found for NPC: ${context.npcId}`)
      return { text: '...' }
    }

    const systemPrompt = this.buildSystemPrompt(personality, context)
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...context.conversationHistory.slice(-6),
      { role: 'user' as const, content: playerMessage }
    ]

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        text: data.content || '...',
        stressChange: this.calculateStressChange(personality, data.content),
        respectChange: this.calculateRespectChange(personality, data.content)
      }
    } catch (error) {
      console.error('AI dialogue error:', error)
      return { text: this.getFallbackResponse(personality) }
    }
  }

  private calculateStressChange(_personality: NPCPersonality, response: string): number | undefined {
    if (response.toLowerCase().includes('дедлайн') || 
        response.toLowerCase().includes('срочно')) {
      return 5
    }
    if (response.toLowerCase().includes('отдых') || 
        response.toLowerCase().includes('перерыв')) {
      return -5
    }
    return undefined
  }

  private calculateRespectChange(_personality: NPCPersonality, response: string): number | undefined {
    if (response.toLowerCase().includes('молодец') || 
        response.toLowerCase().includes('отлично') ||
        response.toLowerCase().includes('хорошая работа')) {
      return 3
    }
    return undefined
  }

  private getFallbackResponse(_personality: NPCPersonality): string {
    const fallbacks = [
      `Привет! Чем могу помочь?`,
      `Рад тебя видеть!`,
      `Как дела?`,
      `Слушаю тебя.`
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
}
