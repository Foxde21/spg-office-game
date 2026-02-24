# Выбор карьерного пути (generic система + AI как первый путь)

## Описание
Реализовать механику выбора карьерного пути из **реестра доступных путей**. Система generic — поддерживает любое количество путей, не захардкожена на AI. При respect >= 20 NPC предлагают выбрать специализацию. AI-путь реализуется как первый вариант (через Петю Сеньора). В будущем другие NPC будут предлагать другие пути (Engineering, Product, HR и т.д.) без изменения ядра.

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
1. При respect >= 20 у NPC появляются диалоги о выборе карьерного пути
2. Система поддерживает отображение всех доступных путей из `CAREER_PATHS` реестра
3. После выбора пути карьерный уровень в HUD показывает грейд выбранного пути
4. `PlayerData.careerPath` хранит id выбранного пути (string, не enum)
5. Флаг `careerPathChosen` сохраняется в GameState
6. NPC реагируют на выбранный путь в своих диалогах
7. Повышение по грейду зависит от AssessmentManager (не от respect)
8. AI-путь работает: выбор через Петю Сеньора, грейды AI Junior → AI Architect
9. Стресс по-прежнему влияет на Game Over

## Технические детали

### Изменения в `src/types/index.ts`

Расширить `PlayerData`:
```typescript
export interface PlayerData {
  // ... существующие поля
  careerPath?: string  // id из CareerPath.id ('ai', 'engineering', 'product', ...)
}
```

Расширить `GameState`:
```typescript
export interface GameState {
  // ... существующие поля
  assessment?: AssessmentState
}
```

### Изменения в `src/config.ts`

```typescript
export const CAREER_PATH_UNLOCK_RESPECT = 20
```

НЕ хардкодим конкретные уровни — они живут внутри `CareerPath.levels`.

### Изменения в `src/managers/GameState.ts`

- `getCareerLevel()` — если `careerPath` задан, возвращать текущий грейд из AssessmentManager
- `canPromote()` — если путь выбран, делегировать AssessmentManager
- `promote()` — делегировать AssessmentManager
- Новый метод: `setCareerPath(pathId: string)`
- Новый метод: `getCareerPath(): string | undefined`
- `getCareerPath` работает с **любой строкой**, не привязан к конкретным путям

### Диалог-триггер: generic

Каждый карьерный путь в `CareerPath` указывает `unlockCondition` (например, `minRespect: 20`). Когда условие выполнено, соответствующий NPC получает новый диалог.

**Для AI-пути — Петя Сеньор:**

```
Диалог "career-choice-ai" (condition: respect >= 20, NOT flag careerPathChosen):

Петя: "Слушай, я тут заметил — у тебя неплохо идёт.
       Есть один вопрос... Ты задумывался, куда хочешь расти?"

Выбор 1: "Мне интересен AI — хочу разбираться в машинном обучении"
  → Петя: "О! Это серьёзно. Тут есть чему учиться... Я могу помочь."
  → action: setFlag('careerPathChosen'), setCareerPath('ai')
  → respectChange: +5, stressChange: +5

Выбор 2: "Пока не определился..."
  → Петя: "Ладно, подумай. Когда решишь — приходи."
  → (диалог будет повторяться)
```

**В будущем (задачи 026-028) другие NPC будут предлагать свои пути:**
- Тим Лид → Management Track
- Ольга Продакт → Product Track
- Лёша Дизайнер → Design Track
- Маша QA → QA Track
- Игорь Аналитик → Analytics Track
- Анна HR → HR Track

### Механика: НЕ окно с выбором всех путей

Выбор карьеры — **через живое общение с NPC**, а не через меню. Каждый NPC "продаёт" свой путь в своём стиле:
- Петя скептично: "AI — это не для всех, но если потянешь..."
- Ольга энергично: "Product — это про impact! Хочешь влиять на продукт?"
- Маша серьёзно: "Качество — это основа. Хочешь стать гарантом качества?"

Если игрок уже поговорил с несколькими NPC о карьере, но не выбрал, каждый NPC помнит это и может подшучивать: "Всё выбираешь? Ну-ну..."

### Изменения в UIScene (HUD)

- Если `careerPath` задан — показывать грейд из `AssessmentManager.getCurrentLevel().title`
- Если не задан — показывать стандартный уровень (Junior Developer / Middle Developer / ...)
- Цвет грейда берётся из UI (общий стиль)

### Новый DialogueChoice action

Добавить в `DialogueChoice.action` поддержку:
- `setCareerPath:<pathId>` — устанавливает карьерный путь
- Примеры: `setCareerPath:ai`, `setCareerPath:engineering`, `setCareerPath:product`

### Обратная совместимость

Если `careerPath` не выбран (undefined) — игра работает как раньше: Junior → Middle → Senior → Lead через respect.

## Зависимости
- 009-competency-matrix-types
- 010-assessment-manager
- 005-more-npcs-dialogues (NPC должны быть в игре)

## Оценка
- Story Points: 5
- Приоритет: High

## Метки
- `feature`, `core`, `gameplay`
