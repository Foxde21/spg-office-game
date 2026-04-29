# Career Path: Engineering Track

## Описание
Создать карьерный путь "Software Engineering" — второй путь после AI. Прогрессия: Junior Dev → Middle Dev → Senior Dev → Solution Architect. Матрица из 6 доменов компетенций, NPC-наставник — Тим Лид. Минимум 12 вопросов для первого домена (Fundamentals), остальные — заглушки.

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
1. Файл `src/data/careerPaths/engineering.ts` создан и экспортирует `ENGINEERING_CAREER_PATH`
2. Зарегистрирован в `src/data/careerPaths/index.ts`
3. 4 уровня грейдов определены
4. 6 доменов компетенций определены
5. Домен "Fundamentals" содержит минимум 12 вопросов (3 на уровень)
6. NPC-ассессоры назначены (Тим Лид — основной)
7. Путь доступен через диалог с Тим Лидом
8. Вопросы — рабочие ситуации, не экзаменационные
9. Работает в Skill Tree UI без изменений (generic система)

## Технические детали

### Файл: `src/data/careerPaths/engineering.ts`

**Грейды:**
```typescript
levels: [
  { id: 'eng-junior', title: 'Junior Developer', minAvgScore: 0, minDomainScore: 0 },
  { id: 'eng-middle', title: 'Middle Developer', minAvgScore: 50, minDomainScore: 30 },
  { id: 'eng-senior', title: 'Senior Developer', minAvgScore: 70, minDomainScore: 50 },
  { id: 'eng-architect', title: 'Solution Architect', minAvgScore: 85, minDomainScore: 70 },
]
```

**6 доменов:**

1. **`eng-fundamentals`** — "Основы разработки"
   - Алгоритмы, структуры данных, сложность, паттерны
   - Junior: Big-O нотация, выбор структуры данных, базовые паттерны
   - Middle: Рефакторинг, SOLID, DRY, trade-offs в алгоритмах
   - Senior: Сложные паттерны, performance optimization, memory management
   - Architect: Архитектурные паттерны, trade-off analysis, технические решения на уровне системы

2. **`eng-backend`** — "Backend-разработка"
   - API design, базы данных, микросервисы, очереди
   - Junior: REST API basics, SQL queries, ORM
   - Middle: API versioning, DB indexing, caching strategies
   - Senior: Микросервисная архитектура, event-driven, CQRS
   - Architect: Distributed systems, CAP theorem, data consistency

3. **`eng-frontend`** — "Frontend-разработка"
   - Фреймворки, state management, performance, accessibility
   - Junior: Component lifecycle, CSS layout, event handling
   - Middle: State management, bundle optimization, testing
   - Senior: SSR/SSG, micro-frontends, design system architecture
   - Architect: Frontend platform strategy, build tooling, cross-team standards

4. **`eng-devops`** — "DevOps & Infrastructure"
   - CI/CD, контейнеры, облака, мониторинг
   - Junior: Docker basics, CI pipeline setup, basic monitoring
   - Middle: Kubernetes, IaC (Terraform), advanced CI/CD
   - Senior: Multi-cloud strategy, SRE practices, incident response
   - Architect: Platform engineering, cost optimization, disaster recovery

5. **`eng-security`** — "Безопасность"
   - OWASP, аутентификация, шифрование, compliance
   - Junior: OWASP top 10, basic auth patterns, HTTPS
   - Middle: OAuth2/OIDC, RBAC, input validation, CSP
   - Senior: Threat modeling, penetration testing, security audit
   - Architect: Security architecture, zero trust, compliance frameworks

6. **`eng-testing`** — "Тестирование и качество"
   - Unit/integration/e2e, TDD, code coverage, test strategy
   - Junior: Unit tests basics, test structure, assertions
   - Middle: Mocking, integration tests, test-driven development
   - Senior: Test architecture, performance testing, chaos engineering
   - Architect: Quality strategy, test infrastructure, release management

**NPC-ассессоры:**
```typescript
npcAssessors: [
  { npcId: 'tim-lead', domainIds: ['eng-fundamentals', 'eng-backend', 'eng-testing'] },
  { npcId: 'petya-senior', domainIds: ['eng-backend', 'eng-devops'] },
  { npcId: 'lesha-designer', domainIds: ['eng-frontend'] },
  { npcId: 'masha-qa', domainIds: ['eng-testing', 'eng-security'] },
]
```

**Примеры вопросов (eng-fundamentals, junior):**

1. Scenario: "Коллега написал функцию поиска элемента в массиве из 1 млн записей. Использует вложенный цикл. Работает 5 секунд."
   Question: "Как ускорить?"
   - "Добавить больше RAM" → score 0
   - "Использовать Map/Set для O(1) lookup" → score 80
   - "Профилировать, определить bottleneck, заменить O(n^2) на O(n) через hash-таблицу" → score 100
   - "Запустить на более быстром сервере" → score 10

2. Scenario: "Тебе дали выбор: использовать стек, очередь или связный список для хранения истории действий пользователя с undo/redo."
   Question: "Что выберешь и почему?"

3. Scenario: "В PR коллега использует 3 вложенных if-else. Метод на 80 строк."
   Question: "Какой фидбек дашь на код-ревью?"

### Диалог Тим Лида (триггер пути)

```
Тим Лид: "Смотри... Я давно за тобой наблюдаю. Ты растёшь.
           Готов определиться с направлением?"

Выбор: "Хочу стать крутым инженером — писать надёжные системы"
  → "Отличный выбор! Инженерия — это про качество и масштаб.
     Приходи, будем разбирать реальные кейсы."
  → action: setCareerPath('engineering')
```

### Регистрация в реестре

В `src/data/careerPaths/index.ts`:
```typescript
import { ENGINEERING_CAREER_PATH } from './engineering'
registerCareerPath(ENGINEERING_CAREER_PATH)
```

## Зависимости
- 009-competency-matrix-types (generic типы)
- 019-career-path-registry (реестр)
- 011-ai-career-branch (механика выбора пути)

## Оценка
- Story Points: 5
- Приоритет: Medium

## Метки
- `feature`, `gameplay`
