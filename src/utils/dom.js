class DOMCache {
  constructor() {
    this.cache = new Map()
  }

  get(id) {
    if (!this.cache.has(id)) {
      const element = document.getElementById(id)
      if (!element) return null
      this.cache.set(id, element)
    }
    return this.cache.get(id)
  }

  set(id, element) {
    this.cache.set(id, element)
  }

  invalidate() {
    this.cache.clear()
  }

  invalidateId(id) {
    this.cache.delete(id)
  }
}

export const domCache = new DOMCache()

export function updateDiceDisplay(container, currentCount, newCount, renderFn) {
  const currentDice = container.children.length

  if (newCount > currentDice) {
    for (let i = currentDice; i < newCount; i++) {
      container.insertAdjacentHTML('beforeend', renderFn(i))
    }
  } else if (newCount < currentDice) {
    for (let i = currentDice - 1; i >= newCount; i--) {
      container.children[i]?.remove()
    }
  }
}

export function renderDice(value, id = 'dice') {
  const faceDots = {
    1: ['<span class="dot"></span>'],
    2: ['<span class="dot"></span>', '<span class="dot"></span>'],
    3: ['<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>'],
    4: ['<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>'],
    5: ['<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>'],
    6: ['<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>', '<span class="dot"></span>']
  }

  const renderFace = (num) => {
    const dots = faceDots[num] || faceDots[1]
    return `<div class="dice-face dice-face-${num}">${dots.join('')}</div>`
  }

  return `
    <div class="dice-scene" id="${id}Scene">
      <div class="dice" id="${id}" data-value="${value}">
        ${renderFace(1)}
        ${renderFace(2)}
        ${renderFace(3)}
        ${renderFace(4)}
        ${renderFace(5)}
        ${renderFace(6)}
      </div>
    </div>
  `
}

export function renderSmallDiceDots(value) {
  const dotPatterns = {
    1: [5],
    2: [3, 7],
    3: [3, 5, 7],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 4, 7, 3, 6, 9]
  }
  const positions = dotPatterns[value] || dotPatterns[1]
  return positions.map(pos => `<span class="history-dot" style="grid-area: ${Math.ceil(pos / 3)} / ${((pos - 1) % 3) + 1}"></span>`).join('')
}

export function renderSmallXucSacDice(value) {
  return `
    <div class="history-dice-small">
      <div class="history-dice-face history-dice-face-${value}">
        ${renderSmallDiceDots(value)}
      </div>
    </div>
  `
}

export function renderSmallBauCuaDice(value, GAME_CONFIG) {
  const imageIndex = parseInt(value)
  const imageName = GAME_CONFIG.BAU_CUA.images[imageIndex]
  return `
    <div class="history-dice-small history-bau-cua-dice">
      <img src="${GAME_CONFIG.BAU_CUA.imageDir}/${imageName}" alt="${GAME_CONFIG.BAU_CUA.names[imageIndex]}" class="history-bau-cua-img">
    </div>
  `
}
