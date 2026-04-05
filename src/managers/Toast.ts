import Phaser from 'phaser'

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger'

export interface ToastPayload {
  text: string
  variant?: ToastVariant
  durationMs?: number
}

export class ToastManager {
  private static instance: ToastManager
  private game: Phaser.Game

  private constructor(game: Phaser.Game) {
    this.game = game
  }

  static getInstance(game?: Phaser.Game): ToastManager {
    if (!ToastManager.instance && game) {
      ToastManager.instance = new ToastManager(game)
    }

    return ToastManager.instance
  }

  show(payload: ToastPayload): void {
    const p: ToastPayload = {
      text: payload.text,
      variant: payload.variant ?? 'info',
      durationMs: payload.durationMs ?? 2000
    }

    this.game.events.emit('uiToast', p)
  }
}
