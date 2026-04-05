class EventManager {
  constructor() {
    this.delegates = new Map()
    this.listeners = new Map()
  }

  delegate(element, eventType, selector, handler) {
    const key = `${eventType}:${selector}`

    const delegatedHandler = (e) => {
      const target = e.target.closest(selector)
      if (target && element.contains(target)) {
        handler.call(target, e)
      }
    }

    element.addEventListener(eventType, delegatedHandler)

    if (!this.delegates.has(key)) {
      this.delegates.set(key, [])
    }
    this.delegates.get(key).push({ element, handler: delegatedHandler, originalHandler: handler })
  }

  on(element, eventType, handler, options = {}) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    element.addEventListener(eventType, handler, options)
    this.listeners.get(eventType).push({ element, handler, options })
  }

  once(element, eventType, handler) {
    const wrappedHandler = (e) => {
      handler(e)
      this.off(element, eventType, wrappedHandler)
    }
    this.on(element, eventType, wrappedHandler)
  }

  off(element, eventType, handler) {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      const index = listeners.findIndex(l => l.element === element && l.handler === handler)
      if (index !== -1) {
        element.removeEventListener(eventType, handler)
        listeners.splice(index, 1)
      }
    }
  }

  cleanup() {
    this.delegates.forEach((delegates, key) => {
      const [eventType] = key.split(':')
      delegates.forEach(({ element, handler }) => {
        element.removeEventListener(eventType, handler)
      })
    })
    this.delegates.clear()

    this.listeners.forEach((listeners, eventType) => {
      listeners.forEach(({ element, handler }) => {
        element.removeEventListener(eventType, handler)
      })
    })
    this.listeners.clear()
  }
}

export const eventManager = new EventManager()
