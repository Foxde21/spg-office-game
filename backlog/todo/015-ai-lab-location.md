# AI Lab — новая локация + NPC Профессор Нейронов

## Описание
Добавить новую локацию "AI Lab" (лаборатория AI), доступную из Open Space после выбора AI-ветки карьеры. В локации находится NPC "Профессор Нейронов" — AI-гуру, который проводит ассесменты продвинутого уровня (senior/architect). Также содержит интерактивные объекты: Whiteboard (открывает Skill Tree) и Сервер (тематический предмет).

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
1. Локация AI Lab добавлена в `src/data/locations.ts`
2. Дверь в AI Lab видна в Open Space, но заблокирована до выбора AI-ветки
3. После `flag: aiPathUnlocked` дверь становится активной
4. AI Lab содержит NPC "Профессор Нейронов" с уникальным характером
5. Профессор проводит ассесменты по продвинутым доменам (system-design, ai-ethics, mlops)
6. Whiteboard (интерактивный объект) открывает Skill Tree при клике
7. Локация визуально отличается от остальных (другой background color, тематические элементы)
8. LocationId тип обновлён

## Технические детали

### Изменения в `src/types/Location.ts`

Обновить тип:
```typescript
export type LocationId = 'open-space' | 'kitchen' | 'meeting-room' | 'director-office' | 'ai-lab'
```

### Добавить в `src/data/locations.ts`

```typescript
{
  id: 'ai-lab',
  name: 'AI Lab',
  width: 1280,
  height: 720,
  backgroundColor: 0x1a1a3e,  // тёмно-синий, "технический" стиль
  doors: [
    {
      id: 'door-to-openspace',
      x: 100,
      y: 400,
      targetLocation: 'open-space',
      spawnX: 900,
      spawnY: 400,
      label: 'Open Space'
    }
  ],
  npcs: [
    {
      id: 'professor-neuronov',
      name: 'Профессор Нейронов',
      role: 'AI Researcher',
      sprite: 'npc',
      x: 640,
      y: 350,
      dialogues: [/* см. ниже */]
    }
  ],
  items: [
    {
      data: {
        id: 'ai-textbook',
        name: 'Учебник по ML',
        description: 'Толстый учебник "Hands-On Machine Learning". Пахнет кофе и дедлайнами.',
        sprite: 'item',
        type: 'document',
        usable: false
      },
      x: 800,
      y: 300
    }
  ]
}
```

### Дверь в AI Lab из Open Space

Добавить в `open-space` данные:
```typescript
{
  id: 'door-to-ai-lab',
  x: 1100,
  y: 400,
  targetLocation: 'ai-lab',
  spawnX: 200,
  spawnY: 400,
  label: 'AI Lab',
  condition: { flag: 'aiPathUnlocked' }  // нужно расширить DoorData
}
```

**Расширить `DoorData` в `src/types/Location.ts`:**
```typescript
export interface DoorData {
  // ... существующие поля
  condition?: {
    flag?: string       // требуется флаг в GameState
    careerPath?: string // требуется определённый карьерный путь
  }
}
```

В GameScene при создании дверей — проверять condition. Если не выполнено, рисовать дверь серой/заблокированной с тултипом "Заблокировано".

### NPC: Профессор Нейронов

**Добавить в `src/data/npcPrompts.ts`:**
```typescript
'professor-neuronov': {
  name: 'Профессор Нейронов',
  role: 'AI Researcher / Professor',
  personality: 'Увлечённый учёный. Говорит сложно, но может объяснить простыми словами. Обожает нейросети и философские вопросы об AI. Немного рассеянный.',
  speechStyle: 'Академичный, но живой. Часто отвлекается на интересные мысли. "Кстати, а знаешь ли ты что...", "Это напоминает мне одну статью..."',
  relationshipWithPlayer: 'Профессор, который видит в игроке потенциал и хочет воспитать AI-архитектора',
  goals: ['Передать глубокие знания', 'Провести продвинутые ассесменты', 'Обсудить этику AI'],
  topics: ['нейросети', 'архитектура моделей', 'этика AI', 'последние исследования', 'ML-системы', 'философия AI']
}
```

**Статические диалоги Профессора:**

Приветственный (первая встреча):
```
Профессор: "О! Новое лицо в лаборатории! Петя говорил, что ты интересуешься AI. 
            Замечательно! Я Профессор Нейронов. Здесь мы изучаем самое интересное — 
            как машины учатся думать. Ну... почти думать."
  > "Рад познакомиться! Готов учиться."
    → "Отлично! Когда будешь готов — приходи, проверим твои знания по продвинутым темам."
  > "А чем конкретно вы тут занимаетесь?"
    → "Проектируем AI-системы, исследуем этику, оптимизируем инфраструктуру... 
        В общем, всё то, что делает Senior и Architect. Когда наберёшь базу — поговорим серьёзно."
```

Ассесмент-диалог (condition: aiCareerLevel >= ai-middle):
```
Профессор: "Чувствую, ты готов к серьёзным вопросам. По какой теме углубимся?"
  > "Проектирование AI-систем" (startAssessment: system-design)
  > "MLOps и деплой" (startAssessment: mlops)
  > "Этика и безопасность AI" (startAssessment: ai-ethics)
  > "Не сейчас, Профессор"
```

### Whiteboard (интерактивный объект)

Реализовать как Item или отдельный интерактивный объект:
- При клике: открывает Skill Tree Panel
- Тултип при наведении: "Whiteboard — ваш прогресс"
- Можно реализовать через существующую систему Item с type `interactive` или через отдельный game object

## Зависимости
- 009-competency-matrix-types
- 010-assessment-manager
- 011-ai-career-branch (флаг aiPathUnlocked, careerPath)
- 012-assessment-dialogues (для ассесментов через Профессора)
- 013-skill-tree-ui (для Whiteboard)

## Оценка
- Story Points: 5
- Приоритет: Medium

## Метки
- `feature`, `gameplay`, `assets`
