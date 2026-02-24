# Multiplayer инфраструктура (WebSocket)

## Описание
Добавить WebSocket-сервер (на базе существующего Express) и клиентский менеджер для real-time мультиплеера. Игроки видят друг друга в офисе (аватары с никнеймами), могут перемещаться по локациям одновременно. Это фундамент для чата, совместных ассесментов и leaderboard.

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
1. WebSocket-сервер (Socket.IO или ws) интегрирован в Express-сервер (`server/index.ts`)
2. Клиентский `MultiplayerManager` (singleton) управляет подключением
3. Игроки видят аватары других игроков в текущей локации
4. Перемещение синхронизируется в реальном времени (позиция x, y)
5. При смене локации аватар исчезает / появляется у других игроков
6. Никнейм отображается над аватаром
7. Graceful disconnect — аватар исчезает при отключении
8. Работает в single-player, если сервер недоступен (fallback)
9. Максимум 20 игроков на сервере (для MVP)

## Технические детали

### Зависимость: Socket.IO

```bash
npm install socket.io          # сервер
npm install socket.io-client   # клиент
```

### Серверная часть: `server/multiplayer.ts`

```typescript
import { Server } from 'socket.io'

interface PlayerInfo {
  id: string
  name: string
  x: number
  y: number
  location: string
  careerPath?: string
  careerLevel?: string
  sprite: string
}

// Events:
// 'player:join'      — игрок подключился
// 'player:move'      — игрок переместился (x, y)
// 'player:location'  — игрок сменил локацию
// 'player:leave'     — игрок отключился
// 'players:list'     — список всех игроков (при подключении)
```

**Интеграция в `server/index.ts`:**
```typescript
import { createServer } from 'http'
import { Server as SocketIO } from 'socket.io'

const httpServer = createServer(app)
const io = new SocketIO(httpServer, { cors: { origin: CLIENT_URL } })

setupMultiplayer(io)

httpServer.listen(SERVER_PORT)  // вместо app.listen
```

### Клиентская часть: `src/managers/Multiplayer.ts`

```typescript
export class MultiplayerManager {
  private static instance: MultiplayerManager
  private socket: Socket | null
  private remotePlayers: Map<string, RemotePlayer>  // id → game object
  private game: Phaser.Game
  private connected: boolean

  static getInstance(game?: Phaser.Game): MultiplayerManager

  connect(playerName: string): void
  disconnect(): void
  isConnected(): boolean

  // Отправка своей позиции (throttled — каждые 50ms макс)
  sendPosition(x: number, y: number): void
  sendLocationChange(locationId: string): void

  // Получение других игроков
  getPlayersInLocation(locationId: string): RemotePlayer[]

  // Подписка на события
  onPlayerJoined(callback: (player: PlayerInfo) => void): void
  onPlayerLeft(callback: (playerId: string) => void): void
  onPlayerMoved(callback: (playerId: string, x: number, y: number) => void): void
}
```

### RemotePlayer — game object для чужого аватара

```typescript
export class RemotePlayer extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite
  private nameLabel: Phaser.GameObjects.Text
  private levelBadge: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, playerInfo: PlayerInfo)

  updatePosition(x: number, y: number): void  // с интерполяцией
  updateInfo(info: Partial<PlayerInfo>): void
  destroy(): void
}
```

### Интерполяция движения

Чужие аватары двигаются плавно (интерполяция между полученными позициями):
```typescript
// В update():
this.x = Phaser.Math.Linear(this.x, targetX, 0.15)
this.y = Phaser.Math.Linear(this.y, targetY, 0.15)
```

### Throttling отправки позиции

Отправлять позицию не чаще чем раз в 50ms:
```typescript
private lastSendTime = 0
sendPosition(x: number, y: number): void {
  const now = Date.now()
  if (now - this.lastSendTime < 50) return
  this.lastSendTime = now
  this.socket?.emit('player:move', { x, y })
}
```

### Изменения в GameScene

- В `update()`: вызывать `MultiplayerManager.sendPosition(player.x, player.y)`
- При смене локации: вызывать `sendLocationChange(locationId)`
- При создании локации: рендерить аватары других игроков из `getPlayersInLocation()`

### Fallback для single-player

Если WebSocket-сервер недоступен:
- `connect()` ставит `connected = false`
- `sendPosition()` и другие методы — no-op
- Игра работает как раньше, без мультиплеера
- Retry connect каждые 10 секунд

### Конфиг

В `.env`:
```
WEBSOCKET_URL=ws://localhost:3001
MAX_PLAYERS=20
```

## Зависимости
- Нет (работает поверх существующего Express-сервера)

## Оценка
- Story Points: 13
- Приоритет: Medium

## Метки
- `feature`, `core`, `gameplay`

## Примечание
Это большая задача. Рекомендуется декомпозировать:
- 020a: Серверная часть (WebSocket + events)
- 020b: Клиентский менеджер + RemotePlayer
- 020c: Интеграция в GameScene + интерполяция
