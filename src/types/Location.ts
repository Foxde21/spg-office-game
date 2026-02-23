import type { ItemData } from './index'

export type LocationId = 'open-space' | 'kitchen' | 'meeting-room' | 'director-office'

export interface DoorData {
  id: string
  x: number
  y: number
  targetLocation: LocationId
  spawnX: number
  spawnY: number
  label?: string
}

export interface NPCSpawnData {
  id: string
  name: string
  role: string
  sprite: string
  x: number
  y: number
  dialogues: import('./index').Dialogue[]
}

export interface ItemSpawnData {
  data: ItemData
  x: number
  y: number
}

export interface LocationData {
  id: LocationId
  name: string
  width: number
  height: number
  doors: DoorData[]
  npcs: NPCSpawnData[]
  items: ItemSpawnData[]
  backgroundColor?: number
}

export interface LocationState {
  currentLocation: LocationId
  visitedLocations: LocationId[]
}
