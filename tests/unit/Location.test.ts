import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { LocationId } from '../../src/types/Location'

class MockGame {
  events = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('LocationManager', () => {
  let locationManager: any
  let mockGame: MockGame

  beforeEach(async () => {
    vi.clearAllMocks()
    mockGame = new MockGame()
    
    const { LocationManager } = await import('../../src/managers/LocationManager')
    
    const instance = (LocationManager as any).instance
    if (instance) {
      instance.game = mockGame
      instance.reset()
    }
    
    locationManager = LocationManager.getInstance(mockGame as any)
  })

  describe('getInstance', () => {
    it('should return a singleton instance', async () => {
      const { LocationManager } = await import('../../src/managers/LocationManager')
      const instance1 = LocationManager.getInstance(mockGame as any)
      const instance2 = LocationManager.getInstance(mockGame as any)
      
      expect(instance1).toBe(instance2)
    })
  })

  describe('getCurrentLocation', () => {
    it('should return starting location by default', () => {
      expect(locationManager.getCurrentLocation()).toBe('open-space')
    })
  })

  describe('getCurrentLocationData', () => {
    it('should return location data for current location', () => {
      const data = locationManager.getCurrentLocationData()
      
      expect(data.id).toBe('open-space')
      expect(data.name).toBe('Open Space')
      expect(data.doors).toBeDefined()
      expect(data.npcs).toBeDefined()
      expect(data.items).toBeDefined()
    })
  })

  describe('getLocationData', () => {
    it('should return location data for valid location id', () => {
      const data = locationManager.getLocationData('kitchen')
      
      expect(data.id).toBe('kitchen')
      expect(data.name).toBe('Кухня')
    })

    it('should return location data for meeting-room', () => {
      const data = locationManager.getLocationData('meeting-room')
      
      expect(data.id).toBe('meeting-room')
      expect(data.name).toBe('Переговорка')
    })

    it('should return location data for director-office', () => {
      const data = locationManager.getLocationData('director-office')
      
      expect(data.id).toBe('director-office')
      expect(data.name).toBe('Кабинет директора')
    })
  })

  describe('getAllLocations', () => {
    it('should return all location data', () => {
      const locations = locationManager.getAllLocations()
      
      expect(Object.keys(locations)).toHaveLength(4)
      expect(locations['open-space']).toBeDefined()
      expect(locations['kitchen']).toBeDefined()
      expect(locations['meeting-room']).toBeDefined()
      expect(locations['director-office']).toBeDefined()
    })
  })

  describe('changeLocation', () => {
    it('should change current location', () => {
      locationManager.changeLocation('kitchen')
      
      expect(locationManager.getCurrentLocation()).toBe('kitchen')
    })

    it('should emit locationChanged event', () => {
      locationManager.changeLocation('kitchen')
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('locationChanged', expect.objectContaining({
        previousLocation: 'open-space',
        currentLocation: 'kitchen',
        locationData: expect.any(Object),
        spawnPosition: expect.any(Object),
      }))
    })

    it('should add location to visited locations', () => {
      locationManager.changeLocation('kitchen')
      
      expect(locationManager.hasVisited('kitchen')).toBe(true)
    })

    it('should return true for valid location', () => {
      const result = locationManager.changeLocation('meeting-room')
      
      expect(result).toBe(true)
    })

    it('should return false for invalid location', () => {
      const result = locationManager.changeLocation('invalid' as LocationId)
      
      expect(result).toBe(false)
    })

    it('should use custom spawn position', () => {
      locationManager.changeLocation('kitchen', 500, 300)
      
      expect(mockGame.events.emit).toHaveBeenCalledWith('locationChanged', expect.objectContaining({
        spawnPosition: { x: 500, y: 300 },
      }))
    })
  })

  describe('getVisitedLocations', () => {
    it('should return array with starting location initially', () => {
      const visited = locationManager.getVisitedLocations()
      
      expect(visited).toContain('open-space')
      expect(visited).toHaveLength(1)
    })

    it('should return all visited locations', () => {
      locationManager.changeLocation('kitchen')
      locationManager.changeLocation('meeting-room')
      
      const visited = locationManager.getVisitedLocations()
      
      expect(visited).toContain('open-space')
      expect(visited).toContain('kitchen')
      expect(visited).toContain('meeting-room')
      expect(visited).toHaveLength(3)
    })
  })

  describe('hasVisited', () => {
    it('should return true for starting location', () => {
      expect(locationManager.hasVisited('open-space')).toBe(true)
    })

    it('should return false for unvisited location', () => {
      expect(locationManager.hasVisited('kitchen')).toBe(false)
    })

    it('should return true after visiting location', () => {
      locationManager.changeLocation('kitchen')
      
      expect(locationManager.hasVisited('kitchen')).toBe(true)
    })
  })

  describe('getState', () => {
    it('should return current state', () => {
      const state = locationManager.getState()
      
      expect(state.currentLocation).toBe('open-space')
      expect(state.visitedLocations).toContain('open-space')
    })
  })

  describe('setState', () => {
    it('should update state', () => {
      locationManager.setState({
        currentLocation: 'kitchen',
        visitedLocations: ['open-space', 'kitchen'],
      })
      
      expect(locationManager.getCurrentLocation()).toBe('kitchen')
      expect(locationManager.hasVisited('kitchen')).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset to starting location', () => {
      locationManager.changeLocation('kitchen')
      locationManager.changeLocation('meeting-room')
      
      locationManager.reset()
      
      expect(locationManager.getCurrentLocation()).toBe('open-space')
      expect(locationManager.getVisitedLocations()).toHaveLength(1)
    })
  })
})
