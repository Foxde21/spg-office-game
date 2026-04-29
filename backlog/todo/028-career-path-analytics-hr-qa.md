# Career Path: Analytics + HR + QA Tracks

## Описание
Создать три карьерных пути: "Business Analytics" (Junior Analyst → Head of Analytics), "People & Culture / HR" (HR Junior → CHRO), "Quality Assurance" (Junior QA → QA Architect). Каждый путь — свой файл, матрица, NPC-наставники (Игорь Аналитик, Анна HR, Маша QA). Минимум 12 вопросов для первого домена каждого пути.

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
1. `src/data/careerPaths/analytics.ts` — Analytics Track
2. `src/data/careerPaths/hr.ts` — HR/People Track
3. `src/data/careerPaths/qa.ts` — QA Track
4. Все три зарегистрированы в реестре
5. Каждый путь: 4 уровня, домены, NPC-ассессоры
6. Первый домен каждого пути: минимум 12 вопросов
7. Диалоги выбора пути для Игоря, Анны, Маши
8. Работает в Skill Tree UI без изменений

## Технические детали

### Analytics Track (`src/data/careerPaths/analytics.ts`)

**Грейды:**
- `analyst-junior` → "Junior Analyst"
- `analyst-middle` → "Business Analyst"
- `analyst-senior` → "Senior Analyst"
- `analyst-head` → "Head of Analytics"

**5 доменов:**

1. **`ba-requirements`** — "Сбор и анализ требований"
   - Бизнес-требования, user stories, acceptance criteria, use cases
   - Junior: Формат user story, acceptance criteria, базовые интервью
   - Middle: Impact mapping, story mapping, conflict resolution
   - Senior: Требования к сложным системам, gap analysis
   - Head: Requirements strategy, governance, cross-program alignment

2. **`ba-data-analysis`** — "Анализ данных"
   - SQL, визуализация, дашборды, статистика
   - Junior: Базовый SQL (SELECT, JOIN, GROUP BY), Excel/Sheets
   - Middle: Сложные запросы, оконные функции, визуализация (Tableau/Power BI)
   - Senior: Статистический анализ, A/B testing, прогнозирование
   - Head: Data strategy, data governance, self-service analytics

3. **`ba-processes`** — "Бизнес-процессы"
   - Моделирование процессов, оптимизация, BPMN, lean
   - Junior: Описание процессов as-is, BPMN basics
   - Middle: Анализ узких мест, to-be процессы, метрики процессов
   - Senior: Process mining, automation strategy, change management
   - Head: Operating model design, digital transformation

4. **`ba-communication`** — "Коммуникация и презентация"
   - Отчёты, презентации, storytelling с данными
   - Junior: Структурированные отчёты, простые дашборды
   - Middle: Data storytelling, executive summaries, workshops
   - Senior: C-level презентации, facilitating complex workshops
   - Head: Org-wide reporting strategy, analytics culture

5. **`ba-domain`** — "Доменная экспертиза"
   - Индустрия, бизнес-модели, финансы, юридические аспекты
   - Junior: Базовое понимание бизнес-модели компании
   - Middle: Конкурентный анализ, unit economics, market sizing
   - Senior: Regulatory landscape, financial modeling
   - Head: Industry thought leadership, strategic advisory

**NPC-ассессоры:**
```typescript
npcAssessors: [
  { npcId: 'igor-analyst', domainIds: ['ba-requirements', 'ba-data-analysis', 'ba-processes', 'ba-communication'] },
  { npcId: 'olga-product', domainIds: ['ba-domain'] },
  { npcId: 'director', domainIds: ['ba-domain', 'ba-communication'], unlockCondition: { minAvgScore: 60 } },
]
```

**Диалог Игоря:**
```
Игорь: "Согласно моим наблюдениям, ты умеешь работать с информацией.
        Аналитика — это не про цифры, это про решения. Интересно?"

Выбор: "Аналитика — это мне близко. Давай разберём требования!"
  → "Отлично. Начнём с базы: как правильно собирать и анализировать требования."
  → action: setCareerPath('analytics')
```

---

### HR / People Track (`src/data/careerPaths/hr.ts`)

**Грейды:**
- `hr-junior` → "HR Junior"
- `hr-bp` → "HR Business Partner"
- `hr-senior` → "Senior HR BP"
- `hr-chro` → "CHRO / People Lead"

**5 доменов:**

1. **`hr-recruitment`** — "Найм и подбор"
   - Sourcing, интервью, оценка кандидатов, employer brand
   - Junior: Job descriptions, screening, базовые интервью
   - Middle: Behavioral interviews, competency-based assessment, pipeline management
   - Senior: Recruitment strategy, employer branding, diversity hiring
   - CHRO: Talent acquisition strategy, workforce planning

2. **`hr-development`** — "Развитие и обучение"
   - Onboarding, обучение, карьерное планирование, менторство
   - Junior: Onboarding checklist, базовые тренинги, feedback
   - Middle: IDPs (Individual Development Plans), performance reviews, mentoring programs
   - Senior: Talent management strategy, succession planning, leadership development
   - CHRO: Learning organization, culture of continuous development

3. **`hr-culture`** — "Корпоративная культура"
   - Ценности, engagement, well-being, конфликты
   - Junior: Организация мероприятий, engagement surveys
   - Middle: Conflict resolution, culture assessment, well-being programs
   - Senior: Culture transformation, change management, DEI initiatives
   - CHRO: Culture strategy, organizational design, values alignment

4. **`hr-compensation`** — "Компенсации и бенефиты"
   - Грейды, зарплаты, бонусы, equity, бенефиты
   - Junior: Понимание грейдовой системы, market benchmarking basics
   - Middle: Compensation review process, total rewards, equity plans
   - Senior: Compensation strategy, retention programs, executive compensation
   - CHRO: Total rewards strategy, board compensation committee

5. **`hr-legal`** — "HR & Право"
   - Трудовое право, compliance, policies, GDPR
   - Junior: Базовое трудовое право, оформление документов
   - Middle: Дисциплинарные процедуры, увольнения, compliance training
   - Senior: Policy development, labor relations, international HR law
   - CHRO: Regulatory strategy, risk management, government relations

**NPC-ассессоры:**
```typescript
npcAssessors: [
  { npcId: 'anna-hr', domainIds: ['hr-recruitment', 'hr-development', 'hr-culture', 'hr-compensation', 'hr-legal'] },
  { npcId: 'director', domainIds: ['hr-culture', 'hr-compensation'], unlockCondition: { minAvgScore: 70 } },
]
```

**Диалог Анны HR:**
```
Анна: "Привет! Знаешь, я заметила — ты хорошо ладишь с людьми.
       Не думал о карьере в People & Culture?"

Выбор: "People — это самое ценное в компании. Расскажи больше!"
  → "Ух, как приятно это слышать! HR — это про людей, рост и культуру. Погнали!"
  → action: setCareerPath('hr')
```

**Примеры вопросов (hr-recruitment, junior):**

Scenario: "К тебе приходит тимлид и просит срочно нанять senior разработчика. 'Нужен вчера'. У тебя нет open headcount, а бюджет на рекрутинг ограничен."
Question: "Что сделаешь?"
- "Срочно постим вакансию на все площадки" → score 20
- "Обсужу с тимлидом приоритеты, проверю headcount, если нет — эскалирую" → score 100
- "Скажу, что без бюджета ничего не могу" → score 10
- "Предложу внутреннюю ротацию как временное решение" → score 70

---

### QA Track (`src/data/careerPaths/qa.ts`)

**Грейды:**
- `qa-junior` → "Junior QA"
- `qa-middle` → "QA Engineer"
- `qa-senior` → "Senior QA Engineer"
- `qa-architect` → "QA Architect"

**5 доменов:**

1. **`qa-fundamentals`** — "Основы тестирования"
   - Test design, test cases, bug reports, test levels
   - Junior: Тест-кейсы, баг-репорты, smoke/regression
   - Middle: Boundary values, equivalence classes, decision tables, state transition
   - Senior: Risk-based testing, model-based testing, exploratory
   - Architect: Test strategy, quality models, metrics framework

2. **`qa-automation`** — "Автоматизация тестирования"
   - UI tests, API tests, frameworks, CI integration
   - Junior: Базовые Selenium/Playwright тесты, simple assertions
   - Middle: Page Object Model, data-driven testing, API test automation
   - Senior: Custom frameworks, parallel execution, flaky test management
   - Architect: Automation strategy, tool selection, infrastructure

3. **`qa-performance`** — "Нагрузочное тестирование"
   - Load testing, stress testing, profiling, bottlenecks
   - Junior: Базовые load tests (JMeter/k6), чтение результатов
   - Middle: Сценарии нагрузки, SLA validation, bottleneck identification
   - Senior: Performance budgets, capacity planning, APM tools
   - Architect: Performance engineering culture, SRE integration

4. **`qa-processes`** — "QA-процессы"
   - Shift-left, continuous testing, quality gates, release management
   - Junior: QA в Agile, definition of done, acceptance testing
   - Middle: Shift-left testing, quality gates, test environments
   - Senior: Continuous testing strategy, quality metrics, CI/CD quality
   - Architect: Org-wide quality culture, process standardization

5. **`qa-security`** — "Тестирование безопасности"
   - OWASP testing, vulnerability scanning, penetration testing
   - Junior: Базовые OWASP checks, input validation testing
   - Middle: Security test automation, vulnerability scanning tools
   - Senior: Penetration testing, threat modeling, security review
   - Architect: Security testing strategy, compliance testing, DevSecOps

**NPC-ассессоры:**
```typescript
npcAssessors: [
  { npcId: 'masha-qa', domainIds: ['qa-fundamentals', 'qa-automation', 'qa-performance', 'qa-processes', 'qa-security'] },
  { npcId: 'petya-senior', domainIds: ['qa-automation'] },
]
```

**Диалог Маши:**
```
Маша: "Привет. Я тут нашла баг... А, это не баг, это feature.
       Шучу. Но знаешь, тестирование — это искусство.
       Хочешь научиться?"

Выбор: "Качество — это фундамент. Научи меня!"
  → "Приятно слышать! Начнём с основ. Готовься, я строгая."
  → action: setCareerPath('qa')
```

## Зависимости
- 009-competency-matrix-types
- 019-career-path-registry
- 011-ai-career-branch (механика выбора)
- 005-more-npcs-dialogues (NPC в игре)

## Оценка
- Story Points: 13 (3 пути, можно параллелить)
- Приоритет: Low

## Метки
- `feature`, `gameplay`
