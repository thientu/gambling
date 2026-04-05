import { GAME_CONFIG } from '../config/game.config.js'

class GameState {
  constructor() {
    this.state = {
      xucSac: {
        diceCount: GAME_CONFIG.XUC_SAC.defaultDice,
        history: []
      },
      bauCua: {
        history: []
      },
      currentRoute: ''
    }
    this.listeners = new Map()
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state)
  }

  set(path, value) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((obj, key) => obj[key], this.state)
    const oldValue = target[lastKey]
    target[lastKey] = value
    this.notify(path, value, oldValue)
  }

  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set())
    }
    this.listeners.get(path).add(callback)
    return () => this.unsubscribe(path, callback)
  }

  unsubscribe(path, callback) {
    const callbacks = this.listeners.get(path)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  notify(path, newValue, oldValue) {
    const callbacks = this.listeners.get(path)
    if (callbacks) {
      callbacks.forEach(cb => cb(newValue, oldValue))
    }
  }

  addHistory(gameType, values) {
    const history = this.state[gameType].history
    history.push({ values, timestamp: Date.now() })
    if (history.length > GAME_CONFIG.MAX_HISTORY) {
      history.shift()
    }
    this.notify(`${gameType}.history`, history)
  }

  getHistory(gameType) {
    return this.state[gameType].history
  }
}

export const gameState = new GameState()
