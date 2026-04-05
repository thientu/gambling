import { GAME_CONFIG } from '../config/game.config.js'

const STORAGE_KEY = 'gamblingGameState'

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
    this.loadFromStorage()
  }

  saveToStorage() {
    try {
      const toSave = {
        xucSac: { history: this.state.xucSac.history },
        bauCua: { history: this.state.bauCua.history }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (error) {
      console.warn('Failed to save game state:', error)
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.xucSac?.history) {
          this.state.xucSac.history = parsed.xucSac.history
        }
        if (parsed.bauCua?.history) {
          this.state.bauCua.history = parsed.bauCua.history
        }
      }
    } catch (error) {
      console.warn('Failed to load game state:', error)
    }
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
    // Convert kebab-case to camelCase if needed
    const camelCaseKey = gameType.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    const history = this.state[camelCaseKey].history
    history.push({ values, timestamp: Date.now() })
    if (history.length > GAME_CONFIG.MAX_HISTORY) {
      history.shift()
    }
    this.notify(`${camelCaseKey}.history`, history)
    this.saveToStorage()
  }

  getHistory(gameType) {
    // Convert kebab-case to camelCase
    const camelCaseKey = gameType.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    return this.state[camelCaseKey]?.history || []
  }
}

export const gameState = new GameState()
