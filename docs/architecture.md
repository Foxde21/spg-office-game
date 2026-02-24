# Архитектура проекта

## Обзор

Office Quest — 2D point-and-click квест / карьерный симулятор на Phaser 3 + TypeScript с мультиплеером, системой ассесментов и мини-играми.

## Стек технологий

- **Phaser 3** — игровой движок
- **TypeScript** — язык программирования
- **Vite** — сборщик, dev-сервер
- **Express** — сервер (AI proxy, мультиплеер API)
- **Socket.IO** — real-time мультиплеер (планируется)
- **OpenRouter API** — AI-диалоги
- **npm** — управление пакетами

## Структура проекта

```
spg-office-game/
├── backlog/                 # Бэклог задач (009-031)
│   ├── todo/               # Готовые к работе
│   ├── in-progress/        # В работе
│   ├── done/               # Выполненные
│   └── README.md           # Описание workflow
├── docs/                    # Документация
├── server/
│   ├── index.ts            # Express + WebSocket сервер
│   ├── routes/
│   │   ├── ai.ts           # AI chat proxy (/api/ai/chat)
│   │   └── leaderboard.ts  # Leaderboard API (планируется)
│   └── multiplayer.ts      # WebSocket events (планируется)
├── src/
│   ├── main.ts             # Точка входа, Phaser game config
│   ├── config.ts           # Константы (GAME_WIDTH, COLORS, ASSESSMENT_SCORING)
│   ├── types/              # TypeScript типы
│   │   ├── index.ts
│   │   ├── ai.ts           # NPCPersonality, AIContext, AIResponse
│   │   ├── assessment.ts   # CareerPath, CompetencyDomain, AssessmentQuestion (планируется)
│   │   ├── achievements.ts # Achievement, AchievementProgress (планируется)
│   │   └── Location.ts     # LocationId, LocationData, DoorData
│   ├── data/               # Конфигурационные данные
│   │   ├── locations.ts    # Данные локаций (Open Space, Kitchen, ...)
│   │   ├── npcPrompts.ts   # AI-личности NPC (8 персонажей)
│   │   ├── careerPaths/    # Plugin-система карьерных путей (планируется)
│   │   │   ├── index.ts    # Career Path Registry
│   │   │   ├── ai.ts       # AI Track (первый)
│   │   │   ├── engineering.ts
│   │   │   ├── product.ts
│   │   │   ├── design.ts
│   │   │   ├── qa.ts
│   │   │   ├── analytics.ts
│   │   │   ├── hr.ts
│   │   │   └── management.ts
│   │   └── miniGames/      # Данные мини-игр (планируется)
│   ├── scenes/             # Игровые сцены
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── GameScene.ts    # Основная игра
│   │   ├── UIScene.ts      # UI слой (HUD, диалоги, Skill Tree)
│   │   └── minigames/      # Мини-игры (планируется)
│   │       ├── CodeReviewGame.ts
│   │       ├── ArchPuzzleGame.ts
│   │       └── SprintPlanGame.ts
│   ├── objects/            # Игровые объекты
│   │   ├── Player.ts
│   │   ├── NPC.ts
│   │   ├── Item.ts
│   │   ├── Door.ts
│   │   ├── RemotePlayer.ts  # Аватар другого игрока (планируется)
│   │   ├── ArcadeMachine.ts # Аркадный автомат (планируется)
│   │   └── ChatBubble.ts    # Чат-бабл (планируется)
│   ├── managers/           # Singleton менеджеры
│   │   ├── GameState.ts
│   │   ├── Quest.ts
│   │   ├── Inventory.ts
│   │   ├── LocationManager.ts
│   │   ├── Save.ts
│   │   ├── AIDialogue.ts
│   │   ├── Assessment.ts    # Ассесменты (планируется)
│   │   ├── Multiplayer.ts   # WebSocket клиент (планируется)
│   │   └── Achievement.ts   # Достижения (планируется)
│   ├── ui/                 # UI компоненты (планируется)
│   │   └── SkillTreePanel.ts
│   └── utils/
├── tests/
│   └── unit/               # Unit тесты (Vitest)
├── e2e/                     # E2E тесты (Playwright)
├── public/assets/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Архитектурные принципы

### 1. Разделение ответственности

Каждый класс отвечает за одну задачу:
- **Scenes** — управление сценами игры
- **Objects** — игровые объекты (Player, NPC, Items)
- **Managers** — управление системами (квесты, инвентарь)
- **Types** — типы данных

### 2. Событийно-ориентированная архитектура

Коммуникация через события Phaser:
```typescript
this.game.events.emit('startDialogue', dialogue)
this.game.events.on('questCompleted', callback)
```

### 3. Менеджеры как Singleton

Глобальные менеджеры:
```typescript
class QuestManager {
  private static instance: QuestManager
  static getInstance(): QuestManager
}
```

### 4. Состояние игры

Централизованное состояние:
```typescript
interface GameState {
  player: PlayerData
  quests: QuestData[]
  inventory: ItemData[]
  npcs: NPCState[]
}
```

## Игровые сцены

### BootScene
- Инициализация игры
- Переход к PreloadScene

### PreloadScene
- Загрузка ассетов
- Создание placeholder-текстур
- Отображение прогресса

### GameScene
- Основной геймплей
- Управление локациями через LocationManager
- Игрок, NPC, предметы, двери
- Синхронизация мультиплеер-аватаров (RemotePlayer)
- Аркадные автоматы (ArcadeMachine)

### UIScene
- UI слой поверх GameScene
- Диалоги (статические + AI + ассесменты)
- Инвентарь [I], Квесты [Q]
- Статус-бар (уровень/грейд, стресс, уважение)
- Мини-карта локаций
- Skill Tree Panel (прогресс по компетенциям)
- Leaderboard Panel
- Achievement popup (toast)
- Chat input + kitchen chat panel

### MiniGameScene (базовый класс, планируется)
- Общий lifecycle: инструкции → игра → результат
- Timer, score, rewards
- Конкретные мини-игры наследуют: CodeReviewGame, ArchPuzzleGame, SprintPlanGame

## Система локаций

Игра разделена на 6 локаций (4 существующие + 2 планируемые):

| Локация | Описание | NPC | Особенности |
|---------|----------|-----|-------------|
| Open Space | Рабочее пространство | Тим Лид | Доска объявлений (leaderboard) |
| Кухня | Social hub | — | Чат мультиплеера, stress -2/30сек |
| Переговорка | Комната встреч | Анна HR | Митинги, конфликты |
| Кабинет директора | Офис CEO | Директор | Финальные квесты |
| AI Lab | Лаборатория AI | Профессор Нейронов | Разблокируется при AI-пути |
| Game Room | Аркадная комната | — | Мини-игры в автоматах |

### Переходы между локациями

- Двери (Door) — объекты для перехода
- LocationManager — управление текущей локацией
- Событие `locationChanged` для синхронизации
- Условные двери: `DoorData.condition` (flag, careerPath)

### Добавление новой локации

1. Добавить тип в `types/Location.ts` (`LocationId`)
2. Создать данные в `data/locations.ts`
3. Определить двери, NPC, предметы
4. Добавить связь с существующими локациями
5. (Опционально) условие разблокировки через `condition`

## Потоки данных

```
User Input
    ↓
GameScene
    ↓
Player.update()
    ↓
Collision Detection
    ↓
Interaction (E key)
    ↓
Event: 'startDialogue'
    ↓
UIScene.renderDialogue()
```

## Career Path Registry (plugin-система)

Каждый карьерный путь — data-модуль в `src/data/careerPaths/`. Добавление нового пути = создание файла + одна строка регистрации.

```
src/data/careerPaths/
├── index.ts          # Registry: registerCareerPath(), getCareerPath(), getAllCareerPaths()
├── ai.ts             # AI_CAREER_PATH: levels, domains, npcAssessors
├── engineering.ts    # ENGINEERING_CAREER_PATH
├── product.ts        # PRODUCT_CAREER_PATH
└── ...               # Каждый файл экспортирует CareerPath
```

### Добавление нового карьерного пути

1. Создать `src/data/careerPaths/<name>.ts`
2. Экспортировать `const <NAME>_CAREER_PATH: CareerPath`
3. В `index.ts`: `registerCareerPath(<NAME>_CAREER_PATH)`
4. Готово — путь появится в выборе, ассесменты и Skill Tree заработают автоматически

## Система ассесментов

### AssessmentManager

Singleton, career-path-agnostic:
- `setCareerPath(id)` — загружает путь из registry
- `getNextQuestion(domainId)` — адаптивная сложность
- `submitAnswer(questionId, choiceId)` — обновляет score, эмитит события
- `getCurrentLevel()` — грейд из `CareerPath.levels`
- `getAvailableDomains()` — учитывает unlock-условия

### Phaser-события

```
assessmentAnswered    → { careerPathId, questionId, score, domainId }
domainProgressChanged → { careerPathId, domainId, oldScore, newScore }
careerLevelUp         → { careerPathId, oldLevel, newLevel }
```

## Mini-Game Framework

Базовый класс `MiniGameScene`:
- `setupGame()`, `updateGame(delta)` — абстрактные, реализует конкретная мини-игра
- Общий lifecycle: instructions → gameplay → results → rewards
- Timer, score, star rating (1-3)
- Rewards автоматически применяются к GameState

## Мультиплеер (планируется)

```
WebSocket Server (Socket.IO)
    ├── player:join / player:leave
    ├── player:move (throttled 50ms)
    ├── player:location
    ├── chat:message (location-scoped)
    ├── duel:invite / duel:answer / duel:result
    └── team:session
```

`MultiplayerManager` (singleton) — fallback к single-player если сервер недоступен.

## Расширяемость

### Добавление новой механики

1. Создать типы в `types/`
2. Создать менеджер в `managers/` (singleton)
3. Добавить UI в `UIScene` или `ui/`
4. Интегрировать в `GameScene`
5. Добавить Phaser-события
6. Расширить `SaveData` для сохранения

### Добавление NPC

1. Создать данные NPC в конфигурации локации
2. Определить диалоги и AI-личность (`npcPrompts.ts`)
3. Привязать квесты и/или ассесмент-домены

### Добавление мини-игры

1. Создать класс, наследующий `MiniGameScene`
2. Зарегистрировать в `MINI_GAMES` registry
3. Добавить аркадный автомат в Game Room

## Производительность

- Object pooling для частых объектов
- Throttled WebSocket events (50ms)
- Интерполяция движения для remote players
- Ленивая загрузка ассетов
- Минимизация redraw UI

## Roadmap (волны реализации)

1. **Core:** Generic типы, AssessmentManager, Career Registry, Save (009-011, 014, 019)
2. **UI + Content:** Ассесмент-диалоги, Skill Tree, AI Lab, контент доменов (012-018)
3. **More Paths:** Engineering, Product, Design, QA, HR, Analytics (026-028)
4. **Multiplayer:** WebSocket, аватары, чат на кухне (020-021)
5. **Game Room:** Mini-game framework, Code Review, Arch Puzzle, Sprint Planning (022-025)
6. **Social:** Достижения, leaderboard, дуэли (029-031)
