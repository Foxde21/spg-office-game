import Phaser from 'phaser'
import type { LocationData, LocationId, LocationState } from '../types/Location'
import { LOCATIONS, STARTING_LOCATION, STARTING_POSITION } from '../data/locations'

export class LocationManager {
  private static instance: LocationManager
  private game: Phaser.Game
  private currentLocation: LocationId
  private visitedLocations: Set<LocationId>

  private constructor(game: Phaser.Game) {
    this.game = game
    this.currentLocation = STARTING_LOCATION
    this.visitedLocations = new Set([STARTING_LOCATION])
  }

  static getInstance(game?: Phaser.Game): LocationManager {
    if (!LocationManager.instance && game) {
      LocationManager.instance = new LocationManager(game)
    }
    return LocationManager.instance
  }

  getCurrentLocation(): LocationId {
    return this.currentLocation
  }

  getCurrentLocationData(): LocationData {
    return LOCATIONS[this.currentLocation]
  }

  getLocationData(id: LocationId): LocationData {
    return LOCATIONS[id]
  }

  getAllLocations(): Record<LocationId, LocationData> {
    return LOCATIONS
  }

  getVisitedLocations(): LocationId[] {
    return Array.from(this.visitedLocations)
  }

  hasVisited(locationId: LocationId): boolean {
    return this.visitedLocations.has(locationId)
  }

  changeLocation(locationId: LocationId, spawnX?: number, spawnY?: number): boolean {
    if (!LOCATIONS[locationId]) {
      console.error(`Location not found: ${locationId}`)
      return false
    }

    const previousLocation = this.currentLocation
    this.currentLocation = locationId
    this.visitedLocations.add(locationId)

    const location = LOCATIONS[locationId]
    const spawn = {
      x: spawnX ?? STARTING_POSITION.x,
      y: spawnY ?? STARTING_POSITION.y,
    }

    this.game.events.emit('locationChanged', {
      previousLocation,
      currentLocation: locationId,
      locationData: location,
      spawnPosition: spawn,
    })

    return true
  }

  getState(): LocationState {
    return {
      currentLocation: this.currentLocation,
      visitedLocations: Array.from(this.visitedLocations),
    }
  }

  setState(state: LocationState): void {
    this.currentLocation = state.currentLocation
    this.visitedLocations = new Set(state.visitedLocations)
  }

  reset(): void {
    this.currentLocation = STARTING_LOCATION
    this.visitedLocations = new Set([STARTING_LOCATION])
  }
}
