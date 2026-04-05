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
      <button class="back-btn" onclick="window.location.hash=''">← Quay lại</button>
      ${content}
    </div>
  `
}

function renderBackButton() {
  return `<button class="back-btn" onclick="window.location.hash=''">← Quay lại</button>`
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
    <div class="dice-container xuc-sac-container" id="diceContainer">
      ${renderDice(6)}
    </div>
    <div class="dice-controls">
      <button class="dice-control-btn" id="decreaseDice">−</button>
      <button class="dice-control-btn" id="increaseDice">+</button>
    </div>
  `)
}

function renderBauCua() {
  const diceHTML = Array.from({ length: GAME_CONFIG.BAU_CUA.diceCount }, (_, i) =>
    renderBauCuaDice(i + 1, 'bau', 'bầu')
  ).join('')

  return renderGamePage('bau-cua', `
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

  return `
    <div class="dice-scene" id="${id}Scene">
      <div class="dice" id="${id}" data-value="${value}">
        <div class="dice-face dice-face-1">${faceDots[1].join('')}</div>
        <div class="dice-face dice-face-2">${faceDots[2].join('')}</div>
        <div class="dice-face dice-face-3">${faceDots[3].join('')}</div>
        <div class="dice-face dice-face-4">${faceDots[4].join('')}</div>
        <div class="dice-face dice-face-5">${faceDots[5].join('')}</div>
        <div class="dice-face dice-face-6">${faceDots[6].join('')}</div>
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

function attachEventListeners() {
  const hash = window.location.hash.slice(1)

  if (hash === 'xuc-sac') {
    attachXucSacListeners()
  } else if (hash === 'bau-cua') {
    attachBauCuaListeners()
  }
}

function attachXucSacListeners() {
  const xucSacPage = document.getElementById('xuc-sac-page')
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
}

function attachBauCuaListeners() {
  const bauCuaPage = document.getElementById('bau-cua-page')
  const backBtn = bauCuaPage?.querySelector('.back-btn')

  backBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
  })

  bauCuaPage?.addEventListener('click', () => {
    rollBauCua()
  })
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
    const extraRotations = {
      x: Math.floor(Math.random() * 4) * 360,
      y: Math.floor(Math.random() * 4) * 360
    }
    dice.style.transform = `rotateX(${extraRotations.x}deg) rotateY(${extraRotations.y}deg)`
  })

  setTimeout(() => {
    diceElements.forEach(dice => {
      const value = Math.floor(Math.random() * 6) + 1
      const rotations = {
        1: { x: 0, y: 0 },
        2: { x: 0, y: 180 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: -90, y: 0 },
        6: { x: 90, y: 0 }
      }
      const extraRotations = {
        x: Math.floor(Math.random() * 2 + 2) * 360,
        y: Math.floor(Math.random() * 2 + 2) * 360
      }
      dice.style.transform = `rotateX(${rotations[value].x + extraRotations.x}deg) rotateY(${rotations[value].y + extraRotations.y}deg)`
      dice.setAttribute('data-value', value)
    })
  }, GAME_CONFIG.ROLL_DURATION)
}

function rollBauCua() {
  const diceElements = document.querySelectorAll('.bau-cua-container .bau-cua-dice')
  if (!diceElements.length) return

  diceElements.forEach(dice => {
    const extraRotations = {
      x: Math.floor(Math.random() * 4) * 360,
      y: Math.floor(Math.random() * 4) * 360
    }
    dice.style.transform = `rotateX(${extraRotations.x}deg) rotateY(${extraRotations.y}deg)`
  })

  setTimeout(() => {
    diceElements.forEach(dice => {
      const value = Math.floor(Math.random() * 6)
      const rotations = {
        0: { x: 0, y: 0 },
        1: { x: 0, y: 180 },
        2: { x: 0, y: -90 },
        3: { x: 0, y: 90 },
        4: { x: -90, y: 0 },
        5: { x: 90, y: 0 }
      }
      const extraRotations = {
        x: Math.floor(Math.random() * 2 + 2) * 360,
        y: Math.floor(Math.random() * 2 + 2) * 360
      }
      dice.style.transform = `rotateX(${rotations[value].x + extraRotations.x}deg) rotateY(${rotations[value].y + extraRotations.y}deg)`
      dice.setAttribute('data-value', value)
    })
  }, GAME_CONFIG.ROLL_DURATION)
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
