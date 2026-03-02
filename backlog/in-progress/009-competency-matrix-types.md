# Типы и матрица компетенций (generic + AI-домен)

## Описание
Создать **расширяемую** систему TypeScript-типов для карьерных путей и ассесментов. Типы должны быть generic — поддерживать любое количество карьерных путей (AI, Engineering, Product, QA, HR и т.д.) без изменения ядра. AI-домен (ML Fundamentals, 12 вопросов) реализуется как первый "плагин". Это фундамент всей платформы.

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
1. Созданы TypeScript-интерфейсы в `src/types/assessment.ts` — generic, не привязаны к конкретному карьерному пути
2. Создан интерфейс `CareerPath` — описывает любой карьерный путь (уровни, домены, NPC)
3. `CompetencyDomainId` — строка (не фиксированный union), чтобы каждый путь регистрировал свои домены
4. Экспортированы из `src/types/index.ts`
5. Создан файл `src/data/careerPaths/ai.ts` с AI-путём и матрицей компетенций
6. Создан `src/data/careerPaths/index.ts` — реестр карьерных путей (экспортирует все пути)
7. Домен ML Fundamentals содержит минимум 12 вопросов (3 на каждый уровень)
8. Каждый вопрос — рабочая ситуация (не экзаменационный вопрос)
9. У каждого варианта ответа есть score (0-100), feedback и competencyTags
10. Типы компилируются без ошибок (`npm run build`)

## Технические детали

### Архитектурный принцип

Каждый карьерный путь — это data-модуль, который подключается к единому движку. Добавление нового пути = создание нового файла в `src/data/careerPaths/`, без изменения core-типов или AssessmentManager.

```
src/data/careerPaths/
├── index.ts          # Реестр: экспортирует все пути
├── ai.ts             # AI Track (первый, реализуется в этой задаче)
├── engineering.ts    # Engineering Track (задача 026)
├── product.ts        # Product Track (задача 027)
├── design.ts         # Design Track (задача 027)
├── qa.ts             # QA Track (задача 028)
├── analytics.ts      # Analytics Track (задача 028)
├── hr.ts             # HR Track (задача 028)
└── management.ts     # Management Track (будущее)
```

### Новый файл: `src/types/assessment.ts`

```typescript
// === Generic Career Path System ===

export interface CareerPathLevel {
  id: string
  title: string
  minAvgScore: number
  minDomainScore: number
}

export interface CareerPath {
  id: string                        // 'ai' | 'engineering' | 'product' | ...
  name: string                      // "AI & Machine Learning"
  description: string               // Краткое описание пути
  icon: string                      // Иконка для UI
  levels: CareerPathLevel[]         // 4 уровня грейдов
  domains: CompetencyDomain[]       // Домены компетенций для этого пути
  npcAssessors: NPCAssessorConfig[] // Какие NPC проводят ассесменты
  unlockCondition?: {               // Когда путь доступен для выбора
    minRespect?: number
    requiredFlag?: string
    requiredQuest?: string
  }
  finalQuestId?: string             // Финальный квест при достижении top-грейда
}

export interface NPCAssessorConfig {
  npcId: string                     // ID NPC из npcPrompts
  domainIds: string[]               // Какие домены этот NPC ассессирует
  unlockCondition?: {               // Когда NPC-ассессор доступен
    minAvgScore?: number
    minDomainsUnlocked?: number
  }
}

// === Competency Matrix ===

export interface CompetencyDomain {
  id: string                        // Строка — не enum, расширяемо!
  name: string
  description: string
  icon: string
  careerPathId: string              // К какому пути принадлежит
  topics: CompetencyTopic[]
  unlockCondition?: {               // Когда домен открывается
    minScoreInAnyDomain?: number
    minDomainsWithScore?: { count: number; minScore: number }
  }
}

export interface CompetencyTopic {
  id: string
  name: string
  level: string                     // Строка — маппится на CareerPathLevel.id
  questions: AssessmentQuestion[]
}

export interface AssessmentQuestion {
  id: string
  scenario: string
  question: string
  choices: AssessmentChoice[]
  explanation: string
  domainId: string
  difficulty: 1 | 2 | 3 | 4
}

export interface AssessmentChoice {
  id: string
  text: string
  score: number                     // 0-100
  feedback: string
  competencyTags: string[]
}

// === Player Progress ===

export interface DomainProgress {
  domainId: string
  score: number
  answeredQuestions: string[]
  lastAssessmentDate?: number
}

export interface CareerPathProgress {
  careerPathId: string
  currentLevel: string              // id текущего грейда
  domainProgress: Record<string, DomainProgress>
  totalAssessments: number
  averageScore: number
}

export interface AssessmentState {
  chosenCareerPathId?: string       // undefined = ещё не выбрал
  careerPathProgress?: CareerPathProgress
}

// === Session Types ===

export interface AssessmentSession {
  careerPathId: string
  domainId: string
  questions: AssessmentQuestion[]
  currentIndex: number
  answers: SessionAnswer[]
  startedAt: number
}

export interface SessionAnswer {
  questionId: string
  choiceId: string
  score: number
  timestamp: number
}

export interface SubmitAnswerResult {
  score: number
  feedback: string
  explanation: string
  domainScoreChange: number
  newDomainScore: number
  isCorrect: boolean
  stressChange: number
  respectChange: number
}

export interface SessionResult {
  careerPathId: string
  domainId: string
  questionsCount: number
  averageScore: number
  domainScoreBefore: number
  domainScoreAfter: number
  levelUp: boolean
  newLevel?: string
}
```

### Новый файл: `src/data/careerPaths/index.ts`

```typescript
import type { CareerPath } from '../../types/assessment'
import { AI_CAREER_PATH } from './ai'
// import { ENGINEERING_CAREER_PATH } from './engineering'  // задача 026
// import { PRODUCT_CAREER_PATH } from './product'          // задача 027
// ... добавлять по мере создания

export const CAREER_PATHS: CareerPath[] = [
  AI_CAREER_PATH,
  // ENGINEERING_CAREER_PATH,
  // PRODUCT_CAREER_PATH,
]

export function getCareerPath(id: string): CareerPath | undefined {
  return CAREER_PATHS.find(p => p.id === id)
}

export function getAllCareerPaths(): CareerPath[] {
  return CAREER_PATHS
}
```

### Новый файл: `src/data/careerPaths/ai.ts`

Содержит:
- `AI_CAREER_PATH: CareerPath` — полное описание AI-пути
- 4 уровня: ai-junior, ai-middle, ai-senior, ai-architect
- 8 доменов (ml-fundamentals заполнен, остальные — заглушки с пустыми topics)
- NPC-ассессоры: petya-senior, masha-qa, olga-product, professor-neuronov

**AI Career Path levels:**
```typescript
levels: [
  { id: 'ai-junior', title: 'AI Junior', minAvgScore: 0, minDomainScore: 0 },
  { id: 'ai-middle', title: 'AI Middle', minAvgScore: 50, minDomainScore: 30 },
  { id: 'ai-senior', title: 'AI Senior', minAvgScore: 70, minDomainScore: 50 },
  { id: 'ai-architect', title: 'AI Architect', minAvgScore: 85, minDomainScore: 70 },
]
```

**8 доменов (id → название):**
- `ml-fundamentals` → "Основы машинного обучения"
- `data-engineering` → "Инженерия данных"
- `deep-learning` → "Глубокое обучение"
- `nlp-llms` → "NLP и большие языковые модели"
- `computer-vision` → "Компьютерное зрение"
- `mlops` → "MLOps и деплой моделей"
- `system-design` → "Проектирование AI-систем"
- `ai-ethics` → "Этика и безопасность AI"

**Темы для ML Fundamentals (4 уровня x 3 вопроса):**

Уровень `ai-junior` (difficulty: 1):
- "Тебя просят выбрать модель для предсказания оттока клиентов. Данных — таблица с 10 000 строк. Какой подход выберешь?" (supervised vs unsupervised)
- "У тебя accuracy 95% на модели, которая предсказывает мошенничество. 99% данных — не мошенничество. Довольны?" (class imbalance + метрики)
- "Коллега обучил модель, accuracy на трейне 99%, на тесте 62%. Что скажешь?" (overfitting)

Уровень `ai-middle` (difficulty: 2):
- "Нужно выбрать между precision и recall для медицинской диагностики рака. Что важнее и почему?" (метрики для critical applications)
- "У тебя 50 фичей, но ты подозреваешь, что большинство шум. Как подойдёшь к feature selection?" (feature engineering)
- "Стейкхолдер хочет знать ПОЧЕМУ модель приняла решение. Модель — gradient boosting. Что предложишь?" (interpretability)

Уровень `ai-senior` (difficulty: 3):
- "Нужно обучить модель на данных из 5 стран, но распределения сильно отличаются. Как решишь?" (domain shift)
- "Модель в проде деградирует через 2 месяца. Метрики на тесте были хорошие. Что происходит?" (data drift)
- "Команда спорит: ансамбль из 10 моделей vs одна сложная модель. Тебя просят рассудить." (bias-variance)

Уровень `ai-architect` (difficulty: 4):
- "Нужно построить ML-платформу для команды из 20 DS. Какие компоненты предложишь?" (ML platform)
- "CTO просит сократить время от эксперимента до прода с 3 месяцев до 2 недель. Твоя стратегия?" (MLOps strategy)
- "Регулятор требует объяснять каждое решение модели в кредитном скоринге. Как спроектируешь?" (explainability + compliance)

**Формат вопроса — пример:**
```typescript
{
  id: 'ai-ml-fun-01',
  scenario: 'Ты пришёл на новый проект. Коллега обучил модель предсказания оттока клиентов. Хвастается: accuracy на обучающей выборке — 99.2%, на тестовой — 62.1%.',
  question: 'Что скажешь коллеге?',
  choices: [
    {
      id: 'a',
      text: '"Отличный результат на трейне! Давай деплоить."',
      score: 0,
      feedback: 'Петя Сеньор вздыхает: "Ты серьёзно? 99% на трейне и 62% на тесте — это же учебник по переобучению..."',
      competencyTags: ['overfitting']
    },
    {
      id: 'b',
      text: '"Похоже на переобучение. Попробуй регуляризацию или уменьши сложность модели."',
      score: 80,
      feedback: 'Петя кивает: "Верно, классический overfitting. Регуляризация — хорошее начало."',
      competencyTags: ['overfitting', 'regularization']
    },
    {
      id: 'c',
      text: '"Переобучение. Я бы начал с cross-validation, посмотрел learning curves, проверил data leakage и уже потом решал — регуляризация, early stopping или упрощение модели."',
      score: 100,
      feedback: 'Петя поднимает бровь: "О, а ты шаришь. Именно так — сначала диагностика, потом лечение."',
      competencyTags: ['overfitting', 'cross-validation', 'data-leakage', 'regularization']
    },
    {
      id: 'd',
      text: '"Нужно больше данных, и всё будет ок."',
      score: 25,
      feedback: 'Петя хмыкает: "Больше данных — не всегда ответ. Тут явный overfitting, и причина может быть не в количестве данных."',
      competencyTags: ['overfitting']
    }
  ],
  explanation: 'Разница между accuracy на трейне (99%) и тесте (62%) — классический признак переобучения.',
  domainId: 'ml-fundamentals',
  difficulty: 1
}
```

### Экспорт из `src/types/index.ts`

Добавить строку:
```typescript
export * from './assessment'
```

### Новые константы в `src/config.ts`

```typescript
export const DEFAULT_CAREER_PATH_UNLOCK_RESPECT = 20

export const ASSESSMENT_SCORING = {
  excellent: { minScore: 80, respect: 3, stress: -2 },
  good: { minScore: 50, respect: 1, stress: 0 },
  poor: { minScore: 25, respect: 0, stress: 3 },
  fail: { minScore: 0, respect: -2, stress: 5 },
} as const
```

Не захардкоживаем AI_CAREER_LEVELS отдельно — они живут внутри `CareerPath.levels`.

## Зависимости
- Нет

## Оценка
- Story Points: 5
- Приоритет: High

## Метки
- `feature`, `core`, `gameplay`
