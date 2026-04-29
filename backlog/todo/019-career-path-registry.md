# Career Path Registry — модульная система карьерных путей

## Описание
Реализовать CareerPathRegistry — центральный реестр, через который регистрируются и управляются все карьерные пути. Каждый путь — data-модуль в `src/data/careerPaths/`. Registry предоставляет API для поиска путей, фильтрации по unlock-условиям, получения NPC-ассессоров и доменов. Это ядро расширяемости — новый карьерный путь добавляется одним импортом.

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
1. `src/data/careerPaths/index.ts` экспортирует registry с API
2. `getCareerPath(id)` возвращает путь по id
3. `getAllCareerPaths()` возвращает все зарегистрированные пути
4. `getAvailableCareerPaths(playerState)` фильтрует по unlock-условиям
5. `getAssessorNPCs(careerPathId)` возвращает NPC-ассессоров для пути
6. `getDomainsForPath(careerPathId)` возвращает домены пути
7. Регистрация нового пути — одна строка: импорт + push в массив
8. AI-путь зарегистрирован и работает через registry
9. Unit-тесты на registry API

## Технические детали

### Файл: `src/data/careerPaths/index.ts`

```typescript
import type { CareerPath, PlayerData } from '../../types'

const registry: CareerPath[] = []

export function registerCareerPath(path: CareerPath): void {
  if (registry.find(p => p.id === path.id)) {
    throw new Error(`Career path '${path.id}' already registered`)
  }
  registry.push(path)
}

export function getCareerPath(id: string): CareerPath | undefined {
  return registry.find(p => p.id === id)
}

export function getAllCareerPaths(): CareerPath[] {
  return [...registry]
}

export function getAvailableCareerPaths(player: PlayerData): CareerPath[] {
  return registry.filter(path => {
    if (!path.unlockCondition) return true
    const { minRespect, requiredFlag, requiredQuest } = path.unlockCondition
    if (minRespect && player.respect < minRespect) return false
    // flags/quests проверяются через GameState
    return true
  })
}

export function getAssessorNPCs(careerPathId: string): NPCAssessorConfig[] {
  const path = getCareerPath(careerPathId)
  return path?.npcAssessors || []
}

export function getDomainsForPath(careerPathId: string): CompetencyDomain[] {
  const path = getCareerPath(careerPathId)
  return path?.domains || []
}

// Auto-register paths on import
import { AI_CAREER_PATH } from './ai'
registerCareerPath(AI_CAREER_PATH)

// Будущие пути добавляются так:
// import { ENGINEERING_CAREER_PATH } from './engineering'
// registerCareerPath(ENGINEERING_CAREER_PATH)
```

### Как добавить новый карьерный путь (инструкция для разработчика)

1. Создать файл `src/data/careerPaths/<path-name>.ts`
2. Экспортировать `const <NAME>_CAREER_PATH: CareerPath = { ... }`
3. В `src/data/careerPaths/index.ts` добавить:
   ```typescript
   import { <NAME>_CAREER_PATH } from './<path-name>'
   registerCareerPath(<NAME>_CAREER_PATH)
   ```
4. Готово — путь появится в выборе, ассесменты и Skill Tree заработают автоматически

### Планируемые пути (для reference, реализуются в задачах 026-028)

| ID | Название | Уровни | NPC-наставник |
|----|----------|--------|---------------|
| `ai` | AI & ML | AI Junior → AI Architect | Петя Сеньор, Профессор |
| `engineering` | Software Engineering | Junior Dev → Solution Architect | Тим Лид |
| `product` | Product Management | Junior PM → CPO | Ольга Продакт |
| `design` | UX/UI Design | Junior Designer → Design Lead | Лёша Дизайнер |
| `qa` | Quality Assurance | Junior QA → QA Architect | Маша QA |
| `analytics` | Business Analytics | Junior Analyst → Head of Analytics | Игорь Аналитик |
| `hr` | People & Culture | HR Junior → CHRO | Анна HR |
| `management` | Engineering Management | Team Lead → VP Engineering | Директор |

## Зависимости
- 009-competency-matrix-types (типы CareerPath, CompetencyDomain)

## Оценка
- Story Points: 3
- Приоритет: High

## Метки
- `feature`, `core`
