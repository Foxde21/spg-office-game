# Тестирование Office Quest Game

## Обзор

Проект использует два уровня тестирования:
- **Unit тесты (Vitest)** — тестирование менеджеров и логики
- **E2E тесты (Playwright)** — тестирование геймплея в браузере

## Установка

Зависимости уже установлены в проекте:

```bash
npm install
```

### Дополнительная установка Playwright (для E2E)

```bash
npx playwright install
```

## Unit тесты (Vitest)

### Структура

```
tests/
└── unit/
    ├── GameState.test.ts   # Тесты состояния игры
    ├── Inventory.test.ts   # Тесты инвентаря
    └── Quest.test.ts       # Тесты квестов
```

### Запуск

```bash
npm run test          # Запуск всех unit тестов
npm run test:ui       # Запуск с UI (удобно для отладки)
npm run test:coverage # Запуск с отчётом покрытия
```

### Написание тестов

#### Пример: Тест менеджера

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('GameStateManager', () => {
  let gameState: any
  let mockGame: MockGame

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGame = new MockGame()
    
    const { GameStateManager } = await import('../../src/managers/GameState')
    
    const instance = (GameStateManager as any).instance
    if (instance) {
      instance.game = mockGame
      instance.reset()
    }
    
    gameState = GameStateManager.getInstance(mockGame as any)
  })

  it('should add stress correctly', () => {
    gameState.addStress(10)
    expect(gameState.getStress()).toBe(10)
  })
})
```

### Мокирование Phaser

Для unit тестов нужно мокировать Phaser Game объект:

```typescript
class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}
```

### Чему тестировать

**GameStateManager:**
- Добавление/снижение стресса
- Добавление/снижение уважения
- Повышение в должности
- Game Over при стрессе 100

**InventoryManager:**
- Добавление предметов
- Удаление предметов
- Использование предметов
- Лимит инвентаря (16 слотов)

**QuestManager:**
- Начало квеста
- Завершение квеста
- Прогресс квеста
- Награды за квест

## E2E тесты (Playwright)

### Структура

```
e2e/
└── game.spec.ts    # Тесты геймплея
```

### Запуск

```bash
npm run test:e2e      # Запуск E2E тестов
npm run test:e2e:ui   # Запуск с UI
```

**Примечание:** E2E тесты автоматически запускают dev сервер.

### Написание тестов

#### Пример: Тест взаимодействия

```typescript
import { test, expect } from '@playwright/test'

test('should open inventory with I key', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)
  
  await page.keyboard.press('i')
  await page.waitForTimeout(500)
  
  await expect(page.getByText('Инвентарь')).toBeVisible()
})
```

#### Пример: Тест движения

```typescript
test('should move player with arrow keys', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)
  
  await page.keyboard.press('ArrowRight', { delay: 100 })
  await page.keyboard.press('ArrowDown', { delay: 100 })
  
  await page.waitForTimeout(500)
  
  await expect(page.locator('canvas')).toBeVisible()
})
```

### Чему тестировать

**Инициализация:**
- Загрузка игры
- Отображение UI элементов
- Отображение панели квестов

**Геймплей:**
- Движение игрока
- Взаимодействие с NPC
- Подбор предметов
- Открытие/закрытие инвентаря
- Начало квеста из диалога

**Системы:**
- Изменение стресса
- Game Over при 100 стрессе
- Использование предметов

### Советы по E2E тестам

1. **Ожидание загрузки:** Всегда ждите загрузку игры
   ```typescript
   await page.waitForTimeout(2000)
   ```

2. **Движение к NPC:** Используйте циклы для точного позиционирования
   ```typescript
   for (let i = 0; i < 15; i++) {
     await page.keyboard.press('ArrowRight', { delay: 50 })
   }
   ```

3. **Взаимодействие:** Ждите между действиями
   ```typescript
   await page.keyboard.press('e')
   await page.waitForTimeout(500)
   ```

4. **Проверка UI:** Используйте текст для поиска элементов
   ```typescript
   await expect(page.getByText('Инвентарь')).toBeVisible()
   ```

## Покрытие кода

### Генерация отчёта

```bash
npm run test:coverage
```

### Просмотр отчёта

Откройте `coverage/index.html` в браузере.

### Целевое покрытие

- **Менеджеры:** > 80%
- **Утилиты:** > 70%
- **Общее:** > 60%

### Исключения из покрытия

Файлы, исключённые из отчёта:
- `src/main.ts` — точка входа
- `src/scenes/**` — сцены Phaser
- `src/objects/**` — игровые объекты

## CI/CD интеграция

### GitHub Actions (пример)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Отладка тестов

### Unit тесты

1. Запустите с UI:
   ```bash
   npm run test:ui
   ```

2. Откройте http://localhost:51204

3. Кликните на тест для просмотра деталей

### E2E тесты

1. Запустите с UI:
   ```bash
   npm run test:e2e:ui
   ```

2. Откройте http://localhost:8080

3. Используйте step-through debugging

### Скриншоты и видео

Playwright автоматически сохраняет при падении:
- Скриншоты: `test-results/`
- Видео: `test-results/`
- Traces: `test-results/`

## Best Practices

### 1. Изолированность
Каждый тест должен быть независим:

```typescript
beforeEach(async () => {
  vi.clearAllMocks()
  // Reset state
})
```

### 2. Понятные названия

```typescript
// Плохо
it('should work', () => {})

// Хорошо
it('should add stress correctly when player drinks coffee', () => {})
```

### 3. Один тест — одна проверка

```typescript
// Плохо
it('should handle stress', () => {
  gameState.addStress(10)
  expect(gameState.getStress()).toBe(10)
  gameState.addStress(100)
  expect(gameState.getStress()).toBe(100)
})

// Хорошо
it('should add stress', () => {
  gameState.addStress(10)
  expect(gameState.getStress()).toBe(10)
})

it('should cap stress at 100', () => {
  gameState.addStress(150)
  expect(gameState.getStress()).toBe(100)
})
```

### 4. Моки для внешних зависимостей

```typescript
const mockGame = {
  events: {
    emit: vi.fn(),
  },
}
```

### 5. Асинхронность в E2E

```typescript
await page.waitForTimeout(500)  // Ждём анимации
await expect(element).toBeVisible()  // Ждём появления
```

## Troubleshooting

### Unit тесты падают

**Проблема:** Singleton не сбрасывается
**Решение:** Сбрасывайте instance в beforeEach

```typescript
beforeEach(() => {
  (Manager as any).instance = null
})
```

### E2E тесты падают

**Проблема:** Игра не успевает загрузиться
**Решение:** Увеличьте waitForTimeout

```typescript
await page.waitForTimeout(3000)  // Больше времени на загрузку
```

**Проблема:** Игрок не доходит до NPC
**Решение:** Добавьте больше шагов движения

```typescript
for (let i = 0; i < 20; i++) {  // Больше шагов
  await page.keyboard.press('ArrowRight', { delay: 50 })
}
```

### Playwright не находит элементы

**Проблема:** Текст не найден
**Решение:** Проверьте точный текст или используйте partial match

```typescript
await expect(page.getByText('Инвентарь')).toBeVisible()  // Точное совпадение
await expect(page.locator('text=Инвентарь')).toBeVisible()  // Частичное совпадение
```
