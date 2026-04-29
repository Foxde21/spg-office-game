# Руководство по разработке

## Начало работы

### Требования

- Node.js 18+
- npm 9+

### Установка

```bash
git clone https://github.com/Foxde21/spg-office-game.git
cd spg-office-game
npm install
```

### Запуск

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

## Workflow разработки

Канонический флоу описан в трёх местах — читай все три прежде чем брать первую стори:

- **[`backlog/README.md`](../backlog/README.md)** — story lifecycle (todo → in-progress → done), 3-tier бранчинг, manual checklists для пользователей без slash-команд.
- **[`AGENTS.md`](../AGENTS.md)** — orientation, conventions, роли (`ba-analyst`, `game-dev`, `code-reviewer`), full workflow + branching + commit conventions.
- **[`docs/guides/onboarding.md`](./guides/onboarding.md)** — junior-friendly walkthrough "твои первые 30 минут на проекте": от свежего клона до первого PR.

Кратко: новые стори используют `OQ-XXX` ID, ветки cut-off от `dev` (`feature/OQ-XXX-slug`), PR target — `dev`. Релизы — отдельный PR `dev → main`. **Не коммитим напрямую в `main` или `dev`.** DOR / DOD — гейты, не пропускаем.

Slash-команды (Claude Code): `/new-story`, `/start-story`, `/finish-story`, `/adr`. Codex-эквиваленты — `.codex/prompts/` (см. [`docs/guides/codex-starter-prompt.md`](./guides/codex-starter-prompt.md)) или manual checklist в `backlog/README.md`.

## Стайлгайд

### TypeScript

**Именование:**
- Классы: PascalCase (`PlayerManager`)
- Интерфейсы: PascalCase с суффиксом Data (`PlayerData`)
- Методы: camelCase (`updatePlayer`)
- Константы: UPPER_SNAKE_CASE (`GAME_WIDTH`)
- Переменные: camelCase (`playerSpeed`)

**Структура класса:**
```typescript
class ExampleClass {
  // 1. Свойства
  private property: string
  
  // 2. Конструктор
  constructor() {}
  
  // 3. Публичные методы
  public method(): void {}
  
  // 4. Приватные методы
  private helper(): void {}
}
```

**Импорты:**
```typescript
// 1. Внешние библиотеки
import Phaser from 'phaser'

// 2. Внутренние модули
import { Player } from '../objects/Player'
import { GAME_WIDTH } from '../config'
```

### Phaser

**Сцены:**
- Именование: `<Name>Scene` (`GameScene`, `UIScene`)
- Ключ сцены: совпадает с именем класса

**Игровые объекты:**
- Создавать классы, наследующие от Phaser объектов
- Использовать `scene.add.existing(this)` для добавления на сцену

**События:**
- Предпочитать события Phaser прямым вызовам
- Очищать слушатели при уничтожении объектов

### Файловая структура

```
src/
├── main.ts              # Точка входа
├── config.ts            # Константы
├── types/               # Типы
│   └── index.ts
├── scenes/              # Сцены
├── objects/             # Игровые объекты
├── managers/            # Менеджеры
└── utils/               # Утилиты
```

## Тестирование

### Ручное тестирование

Для каждой задачи:
1. Запустить игру: `npm run dev`
2. Протестировать функционал по критериям приемки
3. Проверить граничные случаи
4. Проверить на разных разрешениях

### Чеклист тестирования

**Базовые проверки:**
- [ ] Игра запускается без ошибок
- [ ] Управление работает
- [ ] UI отображается корректно
- [ ] Нет ошибок в консоли браузера

**Для UI:**
- [ ] Hover эффекты работают
- [ ] Клик по кнопкам срабатывает
- [ ] Текст читаем

**Для диалогов:**
- [ ] Диалог открывается
- [ ] Выборы работают
- [ ] Эффекты применяются

## Отладка

### Phaser DevTools

Установите расширение [Phaser DevTools](https://github.com/PhaserJS/phaser-devtools)

### Полезные команды

```typescript
// В консоли браузера
game.scene.scenes          // Список сцен
game.config                // Конфиг игры
player.x, player.y         // Позиция игрока
game.events.eventNames()   // Все события
```

### Логирование

```typescript
// Использовать console.log с префиксом
console.log('[QuestManager]', 'Quest started', questId)

// Для отладки можно создать утилиту
const debug = (category: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[${category}]`, ...args)
  }
}
```

## Оптимизация

### Производительность

1. **Object Pooling** — переиспользовать объекты
2. **Culling** — не рендерить объекты вне экрана
3. **Texture Atlases** — объединять текстуры
4. **Minimize Physics** — использовать простые коллизии

### Размер бандла

1. **Tree Shaking** — импортировать только нужное
2. **Lazy Loading** — загружать ассеты по требованию
3. **Сжатие** — оптимизировать ассеты

## Git

### Коммиты

Формат: `<type>(<scope>): <message>`

**Типы:**
- `feat` — новый функционал
- `fix` — исправление бага
- `refactor` — рефакторинг
- `docs` — документация
- `style` — форматирование
- `test` — тесты
- `chore` — рутинные задачи

**Примеры:**
```
feat(quests): add quest completion rewards
fix(dialogues): fix choice effects not applying
docs(readme): update installation instructions
```

### Ветки

- `main` — стабильная версия
- `feature/<ticket-id>-<description>` — новая фича
- `bugfix/<ticket-id>-<description>` — исправление бага

## Релизы

### Версионирование

Используем [SemVer](https://semver.org/):
- MAJOR — breaking changes
- MINOR — новый функционал
- PATCH — багфиксы

### Чеклист релиза

1. [ ] Все запланированные задачи выполнены
2. [ ] Тестирование пройдено
3. [ ] Документация обновлена
4. [ ] Версия обновлена в package.json
5. [ ] CHANGELOG обновлен
6. [ ] Тег создан

## Полезные ссылки

- [Phaser 3 Documentation](https://newdocs.phaser.io/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## Получение помощи

- Создайте issue в репозитории
- Проверьте документацию в `docs/`
- Посмотрите примеры в `backlog/done/`
