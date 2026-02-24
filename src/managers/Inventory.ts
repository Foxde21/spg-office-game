import Phaser from 'phaser'
import type { ItemData } from '../types'

export class InventoryManager {
  private static instance: InventoryManager
  private game: Phaser.Game
  private items: Map<string, ItemData> = new Map()
  private maxSlots = 16

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): InventoryManager {
    if (!InventoryManager.instance && game) {
      InventoryManager.instance = new InventoryManager(game)
    }
    return InventoryManager.instance
  }

  addItem(item: ItemData): boolean {
    if (this.items.size >= this.maxSlots) {
      return false
    }

    this.items.set(item.id, item)
    this.game.events.emit('itemAdded', item)
    return true
  }

  removeItem(itemId: string): boolean {
    const item = this.items.get(itemId)
    if (!item) return false

    this.items.delete(itemId)
    this.game.events.emit('itemRemoved', itemId)
    return true
  }

  useItem(itemId: string): ItemData | null {
    const item = this.items.get(itemId)
    if (!item || !item.usable) return null

    this.items.delete(itemId)
    this.game.events.emit('itemUsed', item)
    return item
  }

  hasItem(itemId: string): boolean {
    return this.items.has(itemId)
  }

  getItem(itemId: string): ItemData | undefined {
    return this.items.get(itemId)
  }

  getAllItems(): ItemData[] {
    return Array.from(this.items.values())
  }

  isFull(): boolean {
    return this.items.size >= this.maxSlots
  }

  getCount(): number {
    return this.items.size
  }

  clear(): void {
    this.items.clear()
  }

  loadItems(items: ItemData[]): void {
    this.items.clear()
    items.forEach((item) => this.items.set(item.id, item))
  }
}
