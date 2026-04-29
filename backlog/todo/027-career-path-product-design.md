# Career Path: Product + Design Tracks

## Описание
Создать два карьерных пути: "Product Management" (Junior PM → CPO) и "UX/UI Design" (Junior Designer → Design Lead). Каждый путь — свой файл в careerPaths, своя матрица компетенций, свои NPC-наставники (Ольга Продакт и Лёша Дизайнер). Минимум 12 вопросов для первого домена каждого пути.

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
1. `src/data/careerPaths/product.ts` — Product Track создан и зарегистрирован
2. `src/data/careerPaths/design.ts` — Design Track создан и зарегистрирован
3. Каждый путь: 4 уровня грейдов, домены компетенций, NPC-ассессоры
4. Первый домен каждого пути содержит минимум 12 вопросов
5. Диалоги выбора пути для Ольги и Лёши
6. Работает в Skill Tree UI без изменений

## Технические детали

### Product Track (`src/data/careerPaths/product.ts`)

**Грейды:**
- `pm-junior` → "Junior PM" → minAvgScore: 0
- `pm-middle` → "Product Manager" → minAvgScore: 50
- `pm-senior` → "Senior PM" → minAvgScore: 70
- `pm-cpo` → "CPO" → minAvgScore: 85

**5 доменов:**

1. **`pm-discovery`** — "Product Discovery"
   - Исследование пользователей, проблемные интервью, Jobs-to-be-Done
   - Junior: Базовые user interviews, персоны
   - Middle: JTBD framework, customer journey mapping
   - Senior: Continuous discovery, experiment design
   - CPO: Product strategy, market analysis, competitive intelligence

2. **`pm-delivery`** — "Product Delivery"
   - Agile, спринты, roadmap, приоритизация
   - Junior: Scrum basics, user stories, backlog grooming
   - Middle: Приоритизация (RICE, WSJF), roadmap planning
   - Senior: Cross-team alignment, OKRs, dependency management
   - CPO: Portfolio management, resource allocation, team structure

3. **`pm-metrics`** — "Метрики и аналитика"
   - KPIs, A/B тесты, воронки, retention
   - Junior: Базовые метрики (DAU, MAU, retention), настройка трекинга
   - Middle: A/B testing design, funnel analysis, cohort analysis
   - Senior: Metrics framework, leading vs lagging indicators
   - CPO: Business metrics strategy, unit economics

4. **`pm-stakeholders`** — "Работа со стейкхолдерами"
   - Коммуникация, презентации, управление ожиданиями
   - Junior: Status updates, meeting facilitation
   - Middle: Stakeholder mapping, negotiation, saying "no"
   - Senior: Executive communication, cross-functional leadership
   - CPO: Board presentations, investor relations

5. **`pm-tech`** — "Технический кругозор"
   - Архитектура (на уровне PM), API, базы данных, AI/ML basics
   - Junior: Как работает web, API basics, мобильная разработка
   - Middle: Architectural trade-offs, tech debt management
   - Senior: Platform strategy, build vs buy decisions
   - CPO: Technology vision, innovation management

**NPC-ассессоры:**
```typescript
npcAssessors: [
  { npcId: 'olga-product', domainIds: ['pm-discovery', 'pm-delivery', 'pm-metrics'] },
  { npcId: 'igor-analyst', domainIds: ['pm-metrics', 'pm-stakeholders'] },
  { npcId: 'director', domainIds: ['pm-stakeholders'], unlockCondition: { minAvgScore: 60 } },
]
```

**Диалог Ольги (триггер):**
```
Ольга: "Хей! Слушай, я вижу, ты понимаешь продукт.
        Не задумывался стать Product Manager?"

Выбор: "Продукт — это моё! Хочу влиять на то, что мы делаем."
  → "Yes! С таким подходом далеко пойдёшь. Давай начнём с основ discovery."
  → action: setCareerPath('product')
```

---

### Design Track (`src/data/careerPaths/design.ts`)

**Грейды:**
- `design-junior` → "Junior Designer" → minAvgScore: 0
- `design-middle` → "UX/UI Designer" → minAvgScore: 50
- `design-senior` → "Senior Designer" → minAvgScore: 70
- `design-lead` → "Design Lead" → minAvgScore: 85

**5 доменов:**

1. **`design-ux-research`** — "UX Research"
   - Usability testing, user interviews, heuristic evaluation
   - Junior: Базовое usability testing, задачи пользователей
   - Middle: A/B тесты дизайна, card sorting, tree testing
   - Senior: Research ops, mixed methods, research strategy
   - Lead: Org-wide research culture, ResearchOps management

2. **`design-ui-craft`** — "UI & Visual Design"
   - Типографика, цвет, layout, композиция, дизайн-системы
   - Junior: Основы типографики, цветовые палитры, сетки
   - Middle: Дизайн-система (tokens, components), responsive design
   - Senior: Multi-brand design system, animation principles
   - Lead: Design language evolution, cross-platform consistency

3. **`design-interaction`** — "Interaction Design"
   - Потоки, прототипирование, микро-взаимодействия, accessibility
   - Junior: User flows, wireframes, basic prototyping
   - Middle: Micro-interactions, motion design, prototyping tools
   - Senior: Complex flows, progressive disclosure, error handling patterns
   - Lead: Interaction patterns library, cross-product consistency

4. **`design-systems`** — "Design Systems"
   - Компоненты, токены, документация, масштабирование
   - Junior: Использование существующей дизайн-системы
   - Middle: Создание компонентов, токены, вариации
   - Senior: Архитектура дизайн-системы, governance, versioning
   - Lead: Multi-platform system strategy, adoption metrics

5. **`design-leadership`** — "Design Leadership"
   - Критика, менторство, процессы, стратегия
   - Junior: Принятие и дача фидбека, дизайн-критика
   - Middle: Ведение дизайн-ревью, менторство junior-дизайнеров
   - Senior: Процессы для дизайн-команды, найм, культура
   - Lead: Design vision, org-level design strategy, executive alignment

**NPC-ассессоры:**
```typescript
npcAssessors: [
  { npcId: 'lesha-designer', domainIds: ['design-ux-research', 'design-ui-craft', 'design-interaction', 'design-systems'] },
  { npcId: 'olga-product', domainIds: ['design-ux-research'] },
]
```

**Диалог Лёши (триггер):**
```
Лёша: "*вздыхает* Слушай... Ты единственный, кто заметил,
       что кнопка не по гайдлайнам. Может, дизайн — это твоё?"

Выбор: "Дизайн — это искусство + логика. Я в деле!"
  → "Наконец-то! Кто-то, кто понимает. Давай начнём с UX research."
  → action: setCareerPath('design')
```

### Примеры вопросов

**Product (pm-discovery, junior):**
Scenario: "Стейкхолдер просит добавить новую фичу. Говорит, что 'все клиенты этого хотят'. У вас нет данных."
Question: "Что сделаешь?"
- "Сразу берём в спринт — клиент всегда прав" → score 0
- "Проведу 5 проблемных интервью с клиентами" → score 100
- "Попрошу аналитика посмотреть данные использования" → score 70
- "Создам опрос на 1000 пользователей" → score 40

**Design (design-ui-craft, junior):**
Scenario: "Тебе дают макет лендинга. Заголовок — 48px, body — 12px. Цвет текста #777 на белом фоне. 8 разных шрифтов."
Question: "Какие проблемы видишь?"
- "Всё отлично, красиво" → score 0
- "Контраст #777 на белом недостаточен для accessibility" → score 50
- "Низкий контраст, слишком много шрифтов, большой разрыв в размерах типографики" → score 100
- "Шрифт body слишком маленький" → score 30

## Зависимости
- 009-competency-matrix-types
- 019-career-path-registry
- 011-ai-career-branch (механика выбора)
- 005-more-npcs-dialogues (Ольга и Лёша должны быть в игре)

## Оценка
- Story Points: 8
- Приоритет: Medium

## Метки
- `feature`, `gameplay`
