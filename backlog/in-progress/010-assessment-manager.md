# AssessmentManager — generic менеджер ассесментов

## Описание
Реализовать singleton-менеджер `AssessmentManager`, который работает с **любым карьерным путём** (не только AI). Менеджер принимает `careerPathId`, загружает соответствующую матрицу компетенций из реестра, выбирает вопросы адаптивно по уровню, оценивает ответы, обновляет прогресс по доменам, рассчитывает грейд и интегрируется с `GameStateManager`. По аналогии с `QuestManager` и `InventoryManager`.

## Definition of Ready (DOR)
- [x] Задача четко сформулирована
- [x] Определены критерии приемки
- [x] Оценена сложность (Story Points)
- [x] Нет блокирующих зависимостей
- [x] Определены необходимые ресурсы/ассеты

## Definition of Done (DOD)
- [ ] Код написан и работает
- [ ] Код соответствует стайлгайду
- [ ] Функционал протестирован вручную
- [ ] Нет консольных ошибок
- [ ] Документация обновлена (если требуется)
- [ ] Код прошел ревью (если требуется)

## Критерии приемки
1. `AssessmentManager` создаётся как singleton через `getInstance(game)`
2. Метод `setCareerPath(careerPathId)` загружает путь из реестра и инициализирует прогресс
3. Метод `getNextQuestion(domainId)` возвращает вопрос адаптивной сложности (не повторяет уже отвеченные)
4. Метод `submitAnswer(questionId, choiceId)` обновляет score домена и возвращает feedback
5. Метод `getDomainProgress(domainId)` возвращает текущий прогресс
6. Метод `getCurrentLevel()` рассчитывает текущий грейд по `CareerPath.levels` — **generic, не AI-specific**
7. Метод `startAssessmentSession(domainId, count?)` начинает сессию (3-5 вопросов)
8. Метод `getAssessmentState()` возвращает полное состояние для сохранения
9. Метод `loadState(state)` восстанавливает состояние из сохранения
10. Менеджер эмитит generic Phaser-события (с careerPathId в payload)
11. Написаны unit-тесты (`tests/unit/AssessmentManager.test.ts`)

## Технические детали

### Новый файл: `src/managers/Assessment.ts`

Паттерн — singleton, по аналогии с `src/managers/GameState.ts`.

```typescript
import { getCareerPath } from '../data/careerPaths'

export class AssessmentManager {
  private static instance: AssessmentManager
  private game: Phaser.Game
  private state: AssessmentState
  private careerPath: CareerPath | null
  private currentSession: AssessmentSession | null

  static getInstance(game?: Phaser.Game): AssessmentManager

  // Career Path
  setCareerPath(careerPathId: string): void
  getCareerPath(): CareerPath | null
  getCareerPathId(): string | undefined

  // Основной API
  startAssessmentSession(domainId: string, count?: number): AssessmentSession
  getNextQuestion(domainId: string): AssessmentQuestion | null
  submitAnswer(questionId: string, choiceId: string): SubmitAnswerResult
  endSession(): SessionResult

  // Прогресс (generic — работает с любым путём)
  getDomainProgress(domainId: string): DomainProgress
  getAllProgress(): Record<string, DomainProgress>
  getCurrentLevel(): CareerPathLevel | null
  getAverageScore(): number
  canLevelUp(): boolean
  getAvailableDomains(): CompetencyDomain[]  // учитывает unlockCondition

  // Сохранение/загрузка
  getAssessmentState(): AssessmentState
  loadState(state: AssessmentState): void
  reset(): void
}
```

### Ключевое отличие от предыдущей версии

**Было:** методы типа `getAICareerLevel()`, привязка к `AICareerLevel` type.
**Стало:** `getCurrentLevel()` возвращает `CareerPathLevel` из текущего `CareerPath.levels`. Работает одинаково для AI, Engineering, HR и любого другого пути.

### Логика `getCurrentLevel()`

```typescript
getCurrentLevel(): CareerPathLevel | null {
  if (!this.careerPath || !this.state.careerPathProgress) return null

  const avgScore = this.getAverageScore()
  const progress = this.state.careerPathProgress.domainProgress
  const levels = this.careerPath.levels

  // Идём от высшего уровня к низшему, ищем первый подходящий
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i]
    const allDomainsAboveMin = Object.values(progress)
      .every(d => d.score >= level.minDomainScore)

    if (avgScore >= level.minAvgScore && allDomainsAboveMin) {
      return level
    }
  }

  return levels[0] // fallback to first level
}
```

### Логика `getAvailableDomains()`

Проверяет `CompetencyDomain.unlockCondition` для каждого домена:

```typescript
getAvailableDomains(): CompetencyDomain[] {
  if (!this.careerPath) return []

  return this.careerPath.domains.filter(domain => {
    if (!domain.unlockCondition) return true

    const { minScoreInAnyDomain, minDomainsWithScore } = domain.unlockCondition
    const progress = Object.values(this.state.careerPathProgress?.domainProgress || {})

    if (minScoreInAnyDomain) {
      const hasAny = progress.some(p => p.score >= minScoreInAnyDomain)
      if (!hasAny) return false
    }

    if (minDomainsWithScore) {
      const count = progress.filter(p => p.score >= minDomainsWithScore.minScore).length
      if (count < minDomainsWithScore.count) return false
    }

    return true
  })
}
```

### Логика адаптивной сложности

При выборе следующего вопроса:
1. Получить текущий score домена
2. Выбрать вопросы подходящей сложности:
   - score 0-25 → difficulty 1
   - score 25-50 → difficulty 1-2
   - score 50-70 → difficulty 2-3
   - score 70-85 → difficulty 3-4
   - score 85+ → difficulty 4
3. Исключить уже отвеченные вопросы
4. Из подходящих — выбрать случайный

### Расчёт score домена

При ответе на вопрос:
- `newScore = oldScore * 0.8 + answerScore * 0.2` (экспоненциальное скользящее среднее)
- Делает систему устойчивой: один плохой ответ не обрушит прогресс

### Влияние на GameState (стресс/респект)

Использует `ASSESSMENT_SCORING` из config.ts:
- score >= 80 → respect +3, stress -2 (уверенность)
- score 50-79 → respect +1 (нормально)
- score 25-49 → stress +3 (лёгкий стресс)
- score < 25 → stress +5, respect -2 (провал)

### Generic Phaser-события

```typescript
this.game.events.emit('assessmentAnswered', { careerPathId, questionId, score, domainId })
this.game.events.emit('domainProgressChanged', { careerPathId, domainId, oldScore, newScore })
this.game.events.emit('careerLevelUp', { careerPathId, oldLevel, newLevel })
this.game.events.emit('assessmentSessionCompleted', sessionResult)
```

Все события включают `careerPathId` — подписчики могут фильтровать по пути.

### Unit-тесты: `tests/unit/AssessmentManager.test.ts`

Тест-кейсы:
- Создание singleton-инстанса
- `setCareerPath` загружает путь и инициализирует прогресс
- `getNextQuestion` возвращает вопрос подходящей сложности
- `getNextQuestion` не повторяет отвеченные вопросы
- `getNextQuestion` возвращает null когда вопросы закончились
- `submitAnswer` обновляет score домена
- `submitAnswer` рассчитывает стресс/респект
- `getCurrentLevel` корректен при разных комбинациях scores
- `getAvailableDomains` учитывает unlockCondition
- `startAssessmentSession` создаёт сессию с заданным количеством вопросов
- `loadState`/`getAssessmentState` сериализация корректна
- `reset` сбрасывает всё состояние
- **Работает с мок-путём (не только AI)** — тест на generic-ность

## Зависимости
- 009-competency-matrix-types (типы и данные матрицы)

## Оценка
- Story Points: 8
- Приоритет: High

## Метки
- `feature`, `core`, `gameplay`
