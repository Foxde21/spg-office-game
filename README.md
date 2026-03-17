# Office Quest Game

2D квест-игра: путь от джуна до лида без потери рассудка.

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Управление

- **Стрелки** — перемещение
- **E** — взаимодействие с NPC / подбор предметов
- **I** — открыть/закрыть инвентарь

## Тестирование

```bash
npm run test          # Unit тесты
npm run test:ui       # Unit тесты с UI
npm run test:e2e      # E2E тесты
npm run test:e2e:ui   # E2E тесты с UI
npm run test:all      # Все тесты
```

Подробнее: [docs/testing.md](./docs/testing.md)

## Концепция

Игрок начинает как Junior Developer и должен:
- Выполнять квесты от коллег
- Управлять уровнем стресса
- Зарабатывать уважение команды
- Не попасть под сокращение

После того как игрок набрал достаточно уважения (respect), NPC могут предложить **выбор карьерного пути** (например, AI-путь через Петю Сеньора). Выбранный путь влияет на:
- Отображаемый грейд в HUD
- Логику повышения (через AssessmentManager)
- Реакции NPC в диалогах

Цель — стать Team Lead!

## Документация

Полная документация в папке `docs/`:

- **[Архитектура](./docs/architecture.md)** — структура проекта, принципы
- **[Геймдизайн](./docs/game-design.md)** — механики, персонажи, сюжет
- **[API](./docs/api.md)** — менеджеры, события, типы данных
- **[Ассеты](./docs/assets.md)** — требования к графике и звуку
- **[Разработка](./docs/contributing.md)** — workflow, стайлгайд
- **[Тестирование](./docs/testing.md)** — Vitest + Playwright
- **[Skill Matrices](./docs/spg-skill-matrix/)** — экспорт матриц навыков для Skill Insights

## Career paths (кратко)

- **Условия предложения**
  - При `respect >= 20` и пока не выбран путь (`careerPathChosen = false`) scripted NPC могут стартовать с диалогов `career-choice-*`.
- **Выбор AI пути**
  - Реализован через NPC `petya-senior`.
  - Выбор сохраняется в `PlayerData.careerPath` и флаг `careerPathChosen`.
- **Реакции NPC**
  - После выбора пути scripted NPC могут иметь диалог `career-react-<pathId>` (например, `career-react-ai`).

## Бэклог

Управление задачами в папке `backlog/`:

- **[todo/](./backlog/todo/)** — задачи к выполнению
- **[in-progress/](./backlog/in-progress/)** — в работе
- **[done/](./backlog/done/)** — выполненные

[Читать о workflow](./backlog/README.md)

## Текущий статус

**MVP Progress:**
- [x] Базовая структура проекта
- [x] Управление персонажем
- [x] Система диалогов
- [x] Система квестов
- [x] Инвентарь
- [x] Стресс и уважение
- [x] Тестирование (Vitest + Playwright)
- [ ] Несколько локаций
- [ ] Сохранение прогресса
- [ ] Главное меню
- [ ] Анимации персонажей

## Технологии

- **Phaser 3** — игровой движок
- **TypeScript** — язык
- **Vite** — сборка
- **Vitest** — unit тесты
- **Playwright** — E2E тесты

## Лицензия

MIT
