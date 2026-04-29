# Расширение сохранения для ассесментов

## Описание
Расширить `SaveManager` и тип `SaveData` для сохранения и загрузки прогресса AI-ассесментов: баллы по доменам, история отвеченных вопросов, текущий AI-грейд, выбранный карьерный путь. Обеспечить обратную совместимость — старые сохранения без assessment-данных должны корректно загружаться.

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
1. `SaveData` расширен полем `assessment?: AssessmentState`
2. `SaveManager.save()` сериализует AssessmentManager state
3. `SaveManager.load()` восстанавливает AssessmentManager state
4. Старые сохранения без поля `assessment` загружаются без ошибок (migration)
5. SAVE_VERSION обновлён (например, с '1.0.0' на '1.1.0')
6. `migrateSaveData` корректно мигрирует v1.0.0 → v1.1.0
7. Автосейв включает assessment-данные
8. Написаны unit-тесты на миграцию сохранений

## Технические детали

### Изменения в `src/types/index.ts`

```typescript
export interface SaveData {
  // ... существующие поля
  assessment?: AssessmentState  // новое поле, optional для обратной совместимости
}
```

### Изменения в `src/managers/Save.ts`

**В методе `save()`:**
```typescript
const assessmentManager = AssessmentManager.getInstance(this.game)

const saveData: SaveData = {
  // ... существующие поля
  assessment: assessmentManager.getAssessmentState()
}
```

**В методе `load()`:**
```typescript
const assessmentManager = AssessmentManager.getInstance(this.game)

if (migratedData.assessment) {
  assessmentManager.loadState(migratedData.assessment)
}
```

**В методе `migrateSaveData()`:**
```typescript
// Миграция v1.0.0 → v1.1.0
if (this.versionLessThan(migrated.version, '1.1.0')) {
  migrated.assessment = undefined  // нет данных ассесмента в старых сейвах
  migrated.version = '1.1.0'
}
```

**Обновить константу:**
```typescript
const SAVE_VERSION = '1.1.0'
```

### Unit-тесты: `tests/unit/SaveMigration.test.ts`

Тест-кейсы:
- Загрузка сейва v1.0.0 (без assessment) → корректная миграция
- Сохранение и загрузка v1.1.0 с assessment-данными
- AssessmentState корректно сериализуется/десериализуется
- Пустое assessment (игрок не выбрал AI-путь) → сохраняется undefined
- Данные прогресса по доменам сохраняются между сессиями
- История отвеченных вопросов не теряется
- Round-trip: save → load → save → данные идентичны

## Зависимости
- 009-competency-matrix-types (тип AssessmentState)
- 010-assessment-manager (методы getAssessmentState / loadState)

## Оценка
- Story Points: 3
- Приоритет: High

## Метки
- `feature`, `core`
