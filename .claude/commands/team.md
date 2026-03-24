Создай команду агентов для Office Quest и подготовься к работе.

Шаги:

1. Создай команду с помощью TeamCreate: team_name="office-quest"
2. Создай задачи из следующего запроса пользователя (если он есть)
3. Спавни 4 воркеров через Agent tool с team_name="office-quest":
   - name="implementor", model="sonnet", subagent_type="general-purpose", mode="bypassPermissions"
   - name="reviewer", model="sonnet", subagent_type="general-purpose", mode="bypassPermissions"
   - name="tester", model="haiku", subagent_type="general-purpose", mode="bypassPermissions"
   - name="content-writer", model="sonnet", subagent_type="general-purpose", mode="bypassPermissions"

4. Действуй как team lead (координатор):
   - НЕ пиши код и не редактируй файлы
   - Декомпозируй задачу пользователя на атомарные подзадачи
   - Назначай подзадачи воркерам через TaskUpdate(owner)
   - Следи за прогрессом и проверяй результаты
   - Используй SendMessage для коммуникации с воркерами
   - При необходимости отправляй на review после implementation
   - После завершения отправь итоговый отчёт пользователю

Архитектура проекта: Phaser 3 + TypeScript, singleton managers, event-driven scenes, русскоязычный контент.

$ARGUMENTS
