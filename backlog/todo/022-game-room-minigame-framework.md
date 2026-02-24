# Игровая комната + Mini-Game Framework

## Описание
Добавить новую локацию "Game Room" — комната с аркадными автоматами. Каждый автомат — точка входа в мини-игру. Реализовать Mini-Game Framework — базовый класс для мини-игр (отдельные Phaser Scenes), систему запуска/завершения мини-игр, подсчёт очков и наград. Мини-игры снижают стресс и прокачивают soft skills / дают бонусы.

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
1. Локация Game Room добавлена, доступна из Open Space
2. В Game Room есть 3-5 аркадных автоматов (интерактивные объекты)
3. При клике на автомат — запускается соответствующая мини-игра
4. Базовый класс `MiniGameScene` реализован с общим lifecycle
5. Мини-игра запускается поверх основной игры (pause GameScene)
6. По завершении — экран результатов (score, rewards)
7. Награды применяются к GameState (стресс, респект)
8. Рекорды сохраняются в SaveManager
9. Заглушка мини-игры (placeholder) работает для тестирования framework

## Технические детали

### Локация: Game Room

Добавить в `src/types/Location.ts`:
```typescript
export type LocationId = '...' | 'game-room'
```

Добавить в `src/data/locations.ts`:
```typescript
{
  id: 'game-room',
  name: 'Game Room',
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a2e,  // тёмный, неоновый стиль
  doors: [
    {
      id: 'door-to-openspace',
      x: 100, y: 400,
      targetLocation: 'open-space',
      spawnX: 700, spawnY: 400,
      label: 'Open Space'
    }
  ],
  npcs: [],
  items: [],
  arcadeMachines: [  // новый тип объекта
    { id: 'arcade-code-review', x: 300, y: 300, miniGameId: 'code-review', label: 'Code Review' },
    { id: 'arcade-arch-puzzle', x: 550, y: 300, miniGameId: 'arch-puzzle', label: 'Architecture' },
    { id: 'arcade-sprint-plan', x: 800, y: 300, miniGameId: 'sprint-planning', label: 'Sprint Planning' },
  ]
}
```

Дверь из Open Space в Game Room:
```typescript
{ id: 'door-to-game-room', x: 600, y: 600, targetLocation: 'game-room', ... }
```

### Аркадный автомат — game object

```typescript
export class ArcadeMachine extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite
  private label: Phaser.GameObjects.Text
  private glowEffect: Phaser.GameObjects.Graphics
  private miniGameId: string

  constructor(scene: Phaser.Scene, x: number, y: number, config: ArcadeMachineConfig)

  // При клике — запустить мини-игру
  private onInteract(): void {
    this.scene.game.events.emit('startMiniGame', this.miniGameId)
  }
}
```

Визуал: прямоугольный "автомат" с неоновой подсветкой, название игры на "экране".

### MiniGameScene — базовый класс

```typescript
export abstract class MiniGameScene extends Phaser.Scene {
  protected score: number = 0
  protected timeLimit: number = 60  // секунды
  protected timer: number = 0
  protected isPaused: boolean = false

  // Lifecycle
  abstract getGameId(): string
  abstract getGameName(): string
  abstract getInstructions(): string
  abstract setupGame(): void        // инициализация конкретной игры
  abstract updateGame(delta: number): void  // логика конкретной игры
  abstract getMaxScore(): number

  // Общий lifecycle (не переопределять)
  create(): void {
    this.showInstructions()   // 3 секунды показ правил
    this.setupGame()
    this.startTimer()
  }

  update(time: number, delta: number): void {
    if (this.isPaused) return
    this.updateTimer(delta)
    this.updateGame(delta)
  }

  // Общие методы
  protected addScore(points: number): void
  protected endGame(reason: 'timeout' | 'completed' | 'failed'): void
  protected showResults(): void  // экран результатов

  private showInstructions(): void   // "Правила: ..." с обратным отсчётом
  private startTimer(): void
  private updateTimer(delta: number): void

  // Расчёт наград
  private calculateRewards(): MiniGameRewards {
    const ratio = this.score / this.getMaxScore()
    return {
      stress: ratio > 0.5 ? -10 : -5,   // мини-игры всегда снижают стресс
      respect: ratio > 0.8 ? 3 : ratio > 0.5 ? 1 : 0,
      achievement: ratio >= 1.0 ? `perfect-${this.getGameId()}` : undefined
    }
  }
}
```

### MiniGame Registry

```typescript
// src/data/miniGames.ts
export interface MiniGameConfig {
  id: string
  name: string
  description: string
  sceneKey: string       // ключ Phaser Scene
  timeLimit: number      // секунды
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
}

export const MINI_GAMES: MiniGameConfig[] = [
  { id: 'code-review', name: 'Code Review', description: 'Найди баги в коде!', sceneKey: 'CodeReviewGame', timeLimit: 60, difficulty: 'medium', icon: '🐛' },
  { id: 'arch-puzzle', name: 'Architecture Puzzle', description: 'Собери правильную архитектуру', sceneKey: 'ArchPuzzleGame', timeLimit: 90, difficulty: 'hard', icon: '🏗' },
  { id: 'sprint-planning', name: 'Sprint Planning', description: 'Спланируй спринт!', sceneKey: 'SprintPlanGame', timeLimit: 45, difficulty: 'easy', icon: '📋' },
]
```

### Запуск мини-игры

Процесс:
1. Игрок кликает на аркадный автомат
2. `GameScene` ставится на паузу (`this.scene.pause('GameScene')`)
3. Запускается `MiniGameScene` (`this.scene.launch(sceneKey)`)
4. Мини-игра проходит свой lifecycle
5. По завершении — экран результатов
6. Игрок нажимает "Продолжить"
7. `MiniGameScene` останавливается, `GameScene` возобновляется
8. Награды применяются к GameState

### Экран результатов (внутри MiniGameScene)

```
+----------------------------------+
|       🐛 CODE REVIEW             |
|                                  |
|    Score: 850 / 1000             |
|    ⭐⭐⭐ (3 звезды из 3)        |
|                                  |
|    Награды:                      |
|    Стресс: -10                   |
|    Уважение: +3                  |
|                                  |
|    Лучший результат: 920         |
|                                  |
|    [Играть снова]  [Выход]       |
+----------------------------------+
```

### Рекорды в SaveData

Расширить `SaveData`:
```typescript
export interface SaveData {
  // ... существующее
  miniGameScores?: Record<string, { bestScore: number; playCount: number; lastPlayed: number }>
}
```

### Placeholder мини-игра (для тестирования framework)

Простая "Click the Target" игра:
- Круг появляется в случайном месте
- Нажми на круг → +10 очков
- 60 секунд
- Нужна только для тестирования lifecycle framework

## Зависимости
- Нет (не зависит от мультиплеера — мини-игры работают и в single-player)

## Оценка
- Story Points: 8
- Приоритет: Medium

## Метки
- `feature`, `gameplay`, `ui`
