import './style.css'

// Game configuration
const GAME_CONFIG = {
  ROLL_DURATION: 600,
  XUC_SAC: {
    minDice: 1,
    maxDice: 3,
    defaultDice: 1,
    images: null
  },
  BAU_CUA: {
    diceCount: 3,
    images: ['bau.png', 'cua.png', 'tom.png', 'ca.png', 'ga.png', 'nai.png'],
    names: ['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai'],
    imageDir: '/gambling/bau-cua'
  }
}

// History storage
let xucSacHistory = []
let bauCuaHistory = []
const MAX_HISTORY = 50

const routes = {
  '': renderHome,
  'xuc-sac': renderXucSac,
  'bau-cua': renderBauCua
}

function router() {
  const hash = window.location.hash.slice(1) || ''
  const renderer = routes[hash] || renderHome
  document.querySelector('#app').innerHTML = renderer()
  attachEventListeners()
}

// Shared components
function renderGamePage(gameType, content) {
  const gameClass = gameType === 'xuc-sac' ? 'xuc-sac-page' : 'bau-cua-page'
  return `
    <div class="container game-page ${gameClass}" id="${gameType}Page">
      ${content}
    </div>
  `
}

function renderHome() {
  return `
    <div class="container">
      <h1>Chọn Game</h1>
      <div class="game-grid">
        <a href="#xuc-sac" class="game-card">
          <div class="game-icon">🎲</div>
          <h2>Xúc Xắc</h2>
          <p>Lắc 1-3 viên xúc xắc</p>
        </a>
        <a href="#bau-cua" class="game-card">
          <div class="game-icon">🎯</div>
          <h2>Bầu Cua</h2>
          <p>Lắc 3 viên bầu cua</p>
        </a>
      </div>
    </div>
  `
}

function renderXucSac() {
  return renderGamePage('xuc-sac', `
    ${renderHistoryBar('xuc-sac')}
    <div class="dice-controls">
      <button class="dice-control-btn" id="decreaseDice">−</button>
      <button class="dice-control-btn" id="increaseDice">+</button>
    </div>
    <div class="dice-container xuc-sac-container" id="diceContainer">
      ${renderDice(6)}
    </div>
  `)
}

function renderBauCua() {
  const diceHTML = Array.from({ length: GAME_CONFIG.BAU_CUA.diceCount }, (_, i) =>
    renderBauCuaDice(i + 1, 'bau', 'bầu')
  ).join('')

  return renderGamePage('bau-cua', `
    ${renderHistoryBar('bau-cua')}
    <div class="dice-container bau-cua-container" id="diceContainer">
      ${diceHTML}
    </div>
  `)
}

function renderDice(value, id = 'dice') {
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

function renderBauCuaDice(index, image, alt) {
  const faces = GAME_CONFIG.BAU_CUA.images.map((img, i) => `
    <div class="bau-cua-face bau-cua-face-${i + 1}">
      <img src="${GAME_CONFIG.BAU_CUA.imageDir}/${img}" alt="${GAME_CONFIG.BAU_CUA.names[i]}" class="bau-cua-img">
    </div>
  `).join('')

  return `
    <div class="bau-cua-dice-scene" id="dice${index}Scene">
      <div class="bau-cua-dice" id="dice${index}" data-value="${0}">
        ${faces}
      </div>
    </div>
  `
}

function renderHistoryBar(gameType) {
  const history = gameType === 'xuc-sac' ? xucSacHistory : bauCuaHistory
  const latestRoll = history.length > 0 ? history[history.length - 1] : null

  if (!latestRoll) {
    return '<div class="history-bar history-empty"></div>'
  }

  const smallDice = gameType === 'xuc-sac'
    ? latestRoll.values.map(v => renderSmallXucSacDice(v)).join('')
    : latestRoll.values.map(v => renderSmallBauCuaDice(v)).join('')

  return `
    <div class="history-bar" id="historyBar" onclick="showHistoryModal('${gameType}')">
      <div class="history-label">Lần trước:</div>
      <div class="history-dice">${smallDice}</div>
    </div>
  `
}

function renderSmallXucSacDice(value) {
  return `
    <div class="history-dice-small">
      <div class="history-dice-face history-dice-face-${value}">
        ${renderSmallDiceDots(value)}
      </div>
    </div>
  `
}

function renderSmallBauCuaDice(value) {
  const imageIndex = parseInt(value)
  const imageName = GAME_CONFIG.BAU_CUA.images[imageIndex]
  return `
    <div class="history-dice-small history-bau-cua-dice">
      <img src="${GAME_CONFIG.BAU_CUA.imageDir}/${imageName}" alt="${GAME_CONFIG.BAU_CUA.names[imageIndex]}" class="history-bau-cua-img">
    </div>
  `
}

function renderSmallDiceDots(value) {
  const dotPatterns = {
    1: [1],
    2: [1, 3],
    3: [1, 2, 3],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 4, 7, 3, 6, 9]
  }
  const positions = dotPatterns[value] || dotPatterns[1]
  return positions.map(pos => `<span class="history-dot" style="grid-area: ${Math.ceil(pos / 3)} / ${((pos - 1) % 3) + 1}"></span>`).join('')
}

function showHistoryModal(gameType) {
  const history = gameType === 'xuc-sac' ? xucSacHistory : bauCuaHistory
  if (history.length === 0) return

  const modalHTML = renderHistoryModal(gameType, history)
  const modal = document.createElement('div')
  modal.innerHTML = modalHTML
  document.body.appendChild(modal)

  modal.onclick = (e) => {
    if (e.target === modal || e.target.classList.contains('history-close')) {
      modal.remove()
    }
  }
}

function renderHistoryModal(gameType, history) {
  const gameTitle = gameType === 'xuc-sac' ? 'Xúc Xắc' : 'Bầu Cua'
  const reversedHistory = [...history].reverse()

  const historyItems = reversedHistory.map((roll, index) => {
    const rollNumber = history.length - index
    const time = new Date(roll.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const dice = gameType === 'xuc-sac'
      ? roll.values.map(v => renderSmallXucSacDice(v)).join('')
      : roll.values.map(v => renderSmallBauCuaDice(v)).join('')

    return `
      <div class="history-item">
        <div class="history-item-info">
          <span class="history-item-number">#${rollNumber}</span>
          <span class="history-item-time">${time}</span>
        </div>
        <div class="history-item-dice">${dice}</div>
      </div>
    `
  }).join('')

  return `
    <div class="history-modal-overlay">
      <div class="history-modal">
        <div class="history-modal-header">
          <h2>Lịch sử ${gameTitle}</h2>
          <button class="history-close">&times;</button>
        </div>
        <div class="history-modal-content">
          ${historyItems}
        </div>
      </div>
    </div>
  `
}

function updateHistoryBar(gameType) {
  const historyBar = document.getElementById('historyBar')
  if (!historyBar) return

  const history = gameType === 'xuc-sac' ? xucSacHistory : bauCuaHistory
  const latestRoll = history.length > 0 ? history[history.length - 1] : null

  if (!latestRoll) {
    historyBar.className = 'history-bar history-empty'
    historyBar.innerHTML = ''
    return
  }

  const smallDice = gameType === 'xuc-sac'
    ? latestRoll.values.map(v => renderSmallXucSacDice(v)).join('')
    : latestRoll.values.map(v => renderSmallBauCuaDice(v)).join('')

  historyBar.className = 'history-bar'
  historyBar.innerHTML = `
    <div class="history-label">Lần trước:</div>
    <div class="history-dice">${smallDice}</div>
  `
  historyBar.onclick = () => showHistoryModal(gameType)
}

function attachEventListeners() {
  const hash = window.location.hash.slice(1)

  if (hash === 'xuc-sac') {
    attachXucSacListeners()
  } else if (hash === 'bau-cua') {
    attachBauCuaListeners()
  }
}

function attachXucSacListeners() {
  const xucSacPage = document.getElementById('xuc-sacPage')
  const decreaseBtn = document.getElementById('decreaseDice')
  const increaseBtn = document.getElementById('increaseDice')

  let diceCount = GAME_CONFIG.XUC_SAC.defaultDice

  decreaseBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (diceCount > GAME_CONFIG.XUC_SAC.minDice) {
      diceCount--
      updateDiceDisplay(diceCount)
    }
  })

  increaseBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (diceCount < GAME_CONFIG.XUC_SAC.maxDice) {
      diceCount++
      updateDiceDisplay(diceCount)
    }
  })

  xucSacPage?.addEventListener('click', () => {
    rollXucSac()
  })

  updateShakeCallback(() => rollXucSac())
}

function attachBauCuaListeners() {
  const bauCuaPage = document.getElementById('bau-cuaPage')

  bauCuaPage?.addEventListener('click', () => {
    rollBauCua()
  })

  updateShakeCallback(() => rollBauCua())
}

let currentShakeCallback = null

function updateShakeCallback(callback) {
  currentShakeCallback = callback
}

function initGlobalShakeDetection() {
  const SHAKE_THRESHOLD = 15
  const SHAKE_DEBOUNCE = 1000

  let lastShakeTime = 0
  let isInitialized = false
  let permissionRequested = false

  async function requestMotionPermission() {
    if (permissionRequested) return true
    permissionRequested = true

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission()
        return permissionState === 'granted'
      } catch (error) {
        console.log('Error requesting device motion permission:', error)
        return false
      }
    }
    return true
  }

  function handleMotion(event) {
    const acceleration = event.accelerationIncludingGravity
    if (!acceleration) return

    const { x, y, z } = acceleration
    if (!x || !y || !z) return

    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z)
    const currentTime = Date.now()

    if (accelerationMagnitude > SHAKE_THRESHOLD && currentTime - lastShakeTime > SHAKE_DEBOUNCE) {
      lastShakeTime = currentTime
      if (currentShakeCallback) {
        currentShakeCallback()
      }
    }
  }

  function setupOnFirstInteraction() {
    const setupHandler = async () => {
      const hasPermission = await requestMotionPermission()
      if (hasPermission && !isInitialized) {
        window.addEventListener('devicemotion', handleMotion)
        isInitialized = true
      }
      document.removeEventListener('click', setupHandler)
      document.removeEventListener('touchstart', setupHandler)
    }

    document.addEventListener('click', setupHandler, { once: true })
    document.addEventListener('touchstart', setupHandler, { once: true })
  }

  if (window.DeviceMotionEvent) {
    setupOnFirstInteraction()
  }
}

function updateDiceDisplay(count) {
  const container = document.querySelector('.xuc-sac-container')
  if (!container) return

  container.innerHTML = Array.from({ length: count }, (_, i) =>
    renderDice(6, `dice${i}`)
  ).join('')
}

// Shared rolling animation
function rollDice(diceElements, callback) {
  diceElements.forEach(dice => dice.classList.add('rolling'))

  setTimeout(() => {
    diceElements.forEach(dice => dice.classList.remove('rolling'))
    callback()
  }, GAME_CONFIG.ROLL_DURATION)
}

function rollXucSac() {
  const diceElements = document.querySelectorAll('.xuc-sac-container .dice')
  if (!diceElements.length) return

  diceElements.forEach(dice => {
    const duration = GAME_CONFIG.ROLL_DURATION + Math.floor(Math.random() * 400 - 200)
    dice.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`

    const extraRotations = {
      x: Math.floor(Math.random() * 8) * 360,
      y: Math.floor(Math.random() * 8) * 360,
      z: Math.floor(Math.random() * 8) * 360
    }
    dice.style.transform = `rotateX(${extraRotations.x}deg) rotateY(${extraRotations.y}deg) rotateZ(${extraRotations.z}deg)`
  })

  setTimeout(() => {
    const values = []
    diceElements.forEach(dice => {
      const value = Math.floor(Math.random() * 6) + 1
      values.push(value)
      const rotations = {
        1: { x: 0, y: 0, z: 0 },
        2: { x: 0, y: 180, z: 0 },
        3: { x: 0, y: -90, z: 0 },
        4: { x: 0, y: 90, z: 0 },
        5: { x: -90, y: 0, z: 0 },
        6: { x: 90, y: 0, z: 0 }
      }
      const extraRotations = {
        x: Math.floor(Math.random() * 6 + 3) * 360,
        y: Math.floor(Math.random() * 6 + 3) * 360,
        z: Math.floor(Math.random() * 4 + 2) * 360
      }
      dice.style.transform = `rotateX(${rotations[value].x + extraRotations.x}deg) rotateY(${rotations[value].y + extraRotations.y}deg) rotateZ(${rotations[value].z + extraRotations.z}deg)`
      dice.setAttribute('data-value', value)
    })

    // Save to history
    xucSacHistory.push({
      values: values,
      timestamp: Date.now()
    })

    // Limit history size
    if (xucSacHistory.length > MAX_HISTORY) {
      xucSacHistory.shift()
    }

    // Update history bar
    updateHistoryBar('xuc-sac')
  }, GAME_CONFIG.ROLL_DURATION)
}

function rollBauCua() {
  const diceElements = document.querySelectorAll('.bau-cua-container .bau-cua-dice')
  if (!diceElements.length) return

  diceElements.forEach(dice => {
    const duration = GAME_CONFIG.ROLL_DURATION + Math.floor(Math.random() * 400 - 200)
    dice.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`

    const extraRotations = {
      x: Math.floor(Math.random() * 8) * 360,
      y: Math.floor(Math.random() * 8) * 360,
      z: Math.floor(Math.random() * 8) * 360
    }
    dice.style.transform = `rotateX(${extraRotations.x}deg) rotateY(${extraRotations.y}deg) rotateZ(${extraRotations.z}deg)`
  })

  setTimeout(() => {
    const values = []
    diceElements.forEach(dice => {
      const value = Math.floor(Math.random() * 6)
      values.push(value)
      const rotations = {
        0: { x: 0, y: 0, z: 0 },
        1: { x: 0, y: 180, z: 0 },
        2: { x: 0, y: -90, z: 0 },
        3: { x: 0, y: 90, z: 0 },
        4: { x: -90, y: 0, z: 0 },
        5: { x: 90, y: 0, z: 0 }
      }
      const extraRotations = {
        x: Math.floor(Math.random() * 6 + 3) * 360,
        y: Math.floor(Math.random() * 6 + 3) * 360,
        z: Math.floor(Math.random() * 4 + 2) * 360
      }
      dice.style.transform = `rotateX(${rotations[value].x + extraRotations.x}deg) rotateY(${rotations[value].y + extraRotations.y}deg) rotateZ(${rotations[value].z + extraRotations.z}deg)`
      dice.setAttribute('data-value', value)
    })

    // Save to history
    bauCuaHistory.push({
      values: values,
      timestamp: Date.now()
    })

    // Limit history size
    if (bauCuaHistory.length > MAX_HISTORY) {
      bauCuaHistory.shift()
    }

    // Update history bar
    updateHistoryBar('bau-cua')
  }, GAME_CONFIG.ROLL_DURATION)
}

window.addEventListener('hashchange', router)
window.addEventListener('load', () => {
  router()
  initGlobalShakeDetection()
})
