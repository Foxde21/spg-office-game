# API документация

## Обзор

Внутреннее API игры на основе событий Phaser и менеджеров.

## События (Events)

### Глобальные события (game.events)

#### Диалоги

```typescript
// Начать диалог
game.events.emit('startDialogue', dialogue: Dialogue)

// Завершить диалог
game.events.emit('endDialogue')

// Выбор в диалоге
game.events.emit('dialogueChoice', { choice: DialogueChoice, npc: NPC })
```

#### Квесты

```typescript
// Получен новый квест
game.events.emit('questStarted', quest: QuestData)

// Прогресс квеста
game.events.emit('questProgress', { questId: string, progress: number })

// Квест выполнен
game.events.emit('questCompleted', quest: QuestData)

// Квест провален
game.events.emit('questFailed', quest: QuestData)
```

#### Игрок

```typescript
// Изменение стресса
game.events.emit('stressChanged', { old: number, new: number })

// Изменение уважения
game.events.emit('respectChanged', { old: number, new: number })

// Повышение в должности
game.events.emit('careerLevelUp', { level: CareerLevel })

// Game Over
game.events.emit('gameOver', { reason: string })
```

#### Инвентарь

```typescript
// Предмет добавлен
game.events.emit('itemAdded', item: ItemData)

// Предмет использован
game.events.emit('itemUsed', item: ItemData)

// Предмет удален
game.events.emit('itemRemoved', itemId: string)
```

#### Сохранение

```typescript
// Игра сохранена
game.events.emit('gameSaved', gameState: GameState)

// Игра загружена
game.events.emit('gameLoaded', gameState: GameState)
```

## Менеджеры (Managers)

### GameStateManager

Централизованное управление состоянием игры.

```typescript
class GameStateManager {
  private static instance: GameStateManager
  
  // Singleton
  static getInstance(): GameStateManager
  
  // Состояние
  getState(): GameState
  setState(state: GameState): void
  
  // Игрок
  getPlayer(): PlayerData
  updatePlayer(data: Partial<PlayerData>): void
  
  // Стресс и уважение
  addStress(amount: number): void
  reduceStress(amount: number): void
  addRespect(amount: number): void
  reduceRespect(amount: number): void
  
  // Карьера
  getCareerLevel(): CareerLevel
  promote(): boolean
  
  // Проверки
  isGameOver(): boolean
  canPromote(): boolean
}
```

### QuestManager

Управление квестами.

```typescript
class QuestManager {
  private static instance: QuestManager
  
  static getInstance(): QuestManager
  
  // Получить квесты
  getActiveQuests(): QuestData[]
  getCompletedQuests(): QuestData[]
  
  // Управление квестами
  startQuest(questId: string): boolean
  completeQuest(questId: string): void
  failQuest(questId: string): void
  
  // Прогресс
  updateProgress(questId: string, progress: number): void
  
  // Проверки
  hasQuest(questId: string): boolean
  isQuestCompleted(questId: string): boolean
  
  // Загрузка квестов
  loadQuests(quests: QuestData[]): void
}
```

### InventoryManager

Управление инвентарем.

```typescript
class InventoryManager {
  private static instance: InventoryManager
  private maxSlots: number = 16
  
  static getInstance(): InventoryManager
  
  // Получить предметы
  getItems(): ItemData[]
  getItem(itemId: string): ItemData | undefined
  
  // Управление
  addItem(item: ItemData): boolean
  removeItem(itemId: string): boolean
  useItem(itemId: string): boolean
  
  // Проверки
  hasItem(itemId: string): boolean
  isFull(): boolean
  
  // Сохранение/загрузка
  save(): ItemData[]
  load(items: ItemData[]): void
}
```

### SaveManager

Сохранение и загрузка игры.

```typescript
class SaveManager {
  private static instance: SaveManager
  private saveKey: string = 'officeQuest_save'
  
  static getInstance(): SaveManager
  
  // Сохранение
  save(gameState: GameState): void
  load(): GameState | null
  
  // Слоты
  saveToSlot(slot: number, state: GameState): void
  loadFromSlot(slot: number): GameState | null
  getSaveSlots(): number[]
  
  // Удаление
  deleteSave(): void
  deleteSlot(slot: number): void
  
  // Проверки
  hasSave(): boolean
  hasSlot(slot: number): boolean
}
```

### DialogueManager

Управление диалогами.

```typescript
class DialogueManager {
  private static instance: DialogueManager
  
  static getInstance(): DialogueManager
  
  // Диалоги NPC
  getDialogue(npcId: string, dialogueId: string): Dialogue | undefined
  getNextDialogue(npcId: string, choiceId: string): Dialogue | undefined
  
  // Состояние диалогов
  hasSeenDialogue(dialogueId: string): boolean
  markDialogueSeen(dialogueId: string): void
  
  // Загрузка
  loadDialogues(dialogues: Record<string, Dialogue[]>): void
}
```

## Типы данных

### GameState

```typescript
interface GameState {
  version: string
  player: PlayerData
  quests: {
    active: QuestData[]
    completed: string[]
  }
  inventory: ItemData[]
  npcs: Record<string, NPCState>
  flags: Record<string, boolean>
  timestamp: number
}
```

### PlayerData

```typescript
interface PlayerData {
  name: string
  careerLevel: CareerLevel
  stress: number      // 0-100
  respect: number     // 0-100
  position: { x: number, y: number }
  currentLocation: string
}
```

### QuestData

```typescript
interface QuestData {
  id: string
  title: string
  description: string
  type: 'main' | 'side' | 'daily'
  completed: boolean
  progress: number        // 0-100
  requiredItems?: string[]
  requiredDialogues?: string[]
  rewards: {
    respect?: number
    stress?: number
    items?: string[]
  }
  penalties?: {
    respect?: number
    stress?: number
  }
}
```

### Dialogue

```typescript
interface Dialogue {
  id: string
  lines: DialogueLine[]
}

interface DialogueLine {
  speaker: string
  text: string
  choices?: DialogueChoice[]
}

interface DialogueChoice {
  text: string
  nextDialogue?: string
  action?: string
  effects?: {
    stress?: number
    respect?: number
    giveItem?: string
    takeItem?: string
    startQuest?: string
    completeQuest?: string
  }
  condition?: {
    hasItem?: string
    hasRespect?: number
    hasStress?: number
    flag?: string
  }
}
```

### ItemData

```typescript
interface ItemData {
  id: string
  name: string
  description: string
  type: 'quest' | 'consumable' | 'document'
  usable: boolean
  effects?: {
    stress?: number
    respect?: number
  }
}
```

### NPCState

```typescript
interface NPCState {
  id: string
  relationship: number    // -100 to 100
  seenDialogues: string[]
  completedQuests: string[]
}
```

## Примеры использования

### Добавить квест из NPC диалога

```typescript
// В диалоге NPC
const choice: DialogueChoice = {
  text: 'Конечно, помогу!',
  effects: {
    startQuest: 'find-documentation'
  }
}

// Обработка события
game.events.on('dialogueChoice', ({ choice, npc }) => {
  if (choice.effects?.startQuest) {
    QuestManager.getInstance().startQuest(choice.effects.startQuest)
  }
})
```

### Использовать предмет

```typescript
// Кофе снижает стресс
const coffeeItem: ItemData = {
  id: 'coffee',
  name: 'Кофе',
  type: 'consumable',
  usable: true,
  effects: {
    stress: -10
  }
}

// Использование
const success = InventoryManager.getInstance().useItem('coffee')
if (success && coffeeItem.effects?.stress) {
  GameStateManager.getInstance().addStress(coffeeItem.effects.stress)
}
```

### Проверить условия для повышения

```typescript
const state = GameStateManager.getInstance()
const quests = QuestManager.getInstance()

const canPromote = 
  state.getRespect() >= 75 &&
  quests.getCompletedQuests().length >= 10 &&
  state.getStress() < 70

if (canPromote) {
  state.promote()
  game.events.emit('careerLevelUp', { level: state.getCareerLevel() })
}
```
