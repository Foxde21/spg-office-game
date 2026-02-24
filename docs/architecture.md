# Архитектура проекта

## Обзор

Office Quest — 2D point-and-click квест на Phaser 3 + TypeScript.

## Стек технологий

- **Phaser 3** — игровой движок
- **TypeScript** — язык программирования
- **Vite** — сборщик, dev-сервер
- **npm** — управление пакетами

## Структура проекта

```
spg-office-game/
├── backlog/                 # Бэклог задач
│   ├── todo/               # Готовые к работе
│   ├── in-progress/        # В работе
│   ├── done/               # Выполненные
│   └── README.md           # Описание workflow
├── docs/                    # Документация
├── src/
│   ├── main.ts             # Точка входа
│   ├── config.ts           # Константы игры
│   ├── types/              # TypeScript типы
│   │   ├── index.ts
│   │   └── Location.ts     # Типы локаций
│   ├── data/               # Конфигурационные данные
│   │   └── locations.ts    # Данные локаций
│   ├── scenes/             # Игровые сцены
│   │   ├── BootScene.ts    # Загрузка
│   │   ├── PreloadScene.ts # Прелоадер
│   │   ├── GameScene.ts    # Основная игра
│   │   └── UIScene.ts      # UI слой
│   ├── objects/            # Игровые объекты
│   │   ├── Player.ts       # Игрок
│   │   ├── NPC.ts          # NPC
│   │   ├── Item.ts         # Предметы
│   │   └── Door.ts         # Двери перехода
│   ├── managers/           # Менеджеры
│   │   ├── QuestManager.ts
│   │   ├── InventoryManager.ts
│   │   ├── LocationManager.ts
│   │   └── GameState.ts
│   └── utils/              # Утилиты
├── tests/                   # Тесты
│   └── unit/               # Unit тесты
├── public/
│   └── assets/             # Ассеты игры
│       ├── sprites/        # Спрайты
│       ├── audio/          # Звуки
│       └── fonts/          # Шрифты
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
- Игрок и NPC
- Предметы и двери
- Взаимодействия

### UIScene
- UI слой поверх GameScene
- Диалоги
- Инвентарь [I]
- Квесты [Q]
- Статус-бар (уровень, стресс, уважение)
- Мини-карта локаций

## Система локаций

Игра разделена на 4 локации:

| Локация | Описание | NPC | Предметы |
|---------|----------|-----|----------|
| Open Space | Рабочее пространство | Тим Лид | Энергетик |
| Кухня | Место отдыха | — | Кофе |
| Переговорка | Комната встреч | Анна HR | — |
| Кабинет директора | Офис CEO | Директор | Документация, секретные документы |

### Переходы между локациями

- Двери (Door) — объекты для перехода
- LocationManager — управление текущей локацией
- Событие `locationChanged` для синхронизации

### Добавление новой локации

1. Добавить тип в `types/Location.ts`
2. Создать данные в `data/locations.ts`
3. Определить двери, NPC, предметы
4. Добавить связь с существующими локациями

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

## Расширяемость

### Добавление новой механики

1. Создать типы в `types/index.ts`
2. Создать менеджер в `managers/`
3. Добавить UI в `UIScene`
4. Интегрировать в `GameScene`
5. Добавить события

### Добавление NPC

1. Создать данные NPC в конфигурации локации
2. Определить диалоги
3. Привязать квесты

## Производительность

- Использовать object pooling для частых объектов
- Оптимизировать collision detection
- Ленивая загрузка ассетов
- Минимизировать redraw UI

## Будущие улучшения

- [ ] Система плагинов
- [ ] Моддинг поддержка
- [ ] Мультиплеер (?)
- [ ] Мобильная версия
