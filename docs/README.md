# Документация Office Quest Game

## Структура документации

### Для разработчиков

- **[architecture.md](./architecture.md)** — архитектура проекта, структура файлов, plugin-система, roadmap
- **[api.md](./api.md)** — API документация, менеджеры, события, типы данных
- **[contributing.md](./contributing.md)** — руководство по разработке, стайлгайд, workflow
- **[testing.md](./testing.md)** — стратегия тестирования (unit + e2e)

### Для дизайнеров

- **[game-design.md](./game-design.md)** — GDD: карьерные пути, ассесменты, мини-игры, мультиплеер
- **[assets.md](./assets.md)** — спецификация ассетов, требования, ресурсы

### Для продакта

- **[game-design.md](./game-design.md)** — концепция, 8 карьерных путей, метрики
- **[Бэклог](../backlog/)** — 23 задачи (009-031) с подробными описаниями

## Быстрые ссылки

### Начало работы
1. [Установка и запуск](../README.md)
2. [Workflow разработки](./contributing.md#workflow-разработки)
3. [Стайлгайд](./contributing.md#стайлгайд)

### Разработка
1. [Архитектура](./architecture.md)
2. [Career Path Registry](./architecture.md#career-path-registry-plugin-система) — как добавить новый карьерный путь
3. [Система ассесментов](./architecture.md#система-ассесментов)
4. [Mini-Game Framework](./architecture.md#mini-game-framework)
5. [Мультиплеер](./architecture.md#мультиплеер-планируется)
6. [API менеджеров](./api.md#менеджеры-managers)
7. [События](./api.md#события-events)
8. [Roadmap](./architecture.md#roadmap-волны-реализации)

### Геймдизайн
1. [Концепция игры](./game-design.md#концепция)
2. [Карьерные пути](./game-design.md#1-карьерные-пути-plugin-система) — 8 специализаций
3. [Система ассесментов](./game-design.md#4-система-ассесментов) — NPC-ассессоры, адаптивная сложность
4. [Мини-игры](./game-design.md#8-мини-игры-game-room) — Code Review, Architecture Puzzle, Sprint Planning
5. [Мультиплеер](./game-design.md#9-мультиплеер) — чат, дуэли, команды
6. [Персонажи](./game-design.md#персонажи)
7. [Локации](./game-design.md#локации) — 6 локаций (Open Space, Kitchen, Meeting, Director, AI Lab, Game Room)

### Ассеты
1. [Спецификация спрайтов](./assets.md#спрайты)
2. [Требования к аудио](./assets.md#аудио)
3. [Ресурсы для ассетов](./assets.md#ресурсы-для-ассетов)

## Бэклог (задачи 009-031)

### Wave 1 — Core (High priority)
- 009: Generic типы и матрица компетенций (AI-домен)
- 010: AssessmentManager
- 011: Выбор карьерного пути
- 014: Расширение сохранения
- 019: Career Path Registry

### Wave 2 — UI + AI Content
- 012: Ассесмент-диалоги
- 013: Skill Tree UI
- 015: AI Lab + Профессор Нейронов
- 016: Контент всех AI-доменов
- 017: NPC-ассессоры
- 018: AI Architect финал

### Wave 3 — Career Paths
- 026: Engineering Track
- 027: Product + Design Tracks
- 028: Analytics + HR + QA Tracks

### Wave 4 — Multiplayer
- 020: WebSocket инфраструктура
- 021: Чат-система

### Wave 5 — Game Room
- 022: Mini-Game Framework
- 023: Code Review Challenge
- 024: Architecture Puzzle
- 025: Sprint Planning Simulator

### Wave 6 — Social
- 029: Система достижений
- 030: Leaderboard + профили
- 031: Командные ассесменты (дуэли)

## Обновление документации

Документация должна обновляться:
- При добавлении новых механик или карьерных путей
- При изменении API или добавлении менеджеров
- При изменении архитектуры
- При добавлении новых ассетов или локаций

## Шаблоны

- [Шаблон тикета](../backlog/TEMPLATE.md)

## Контакты

Вопросы по документации:
- Создайте issue в репозитории
- Обратитесь к команде разработки
