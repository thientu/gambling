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
  const dots = Array.from({ length: value }, () => '<span class="dot"></span>').join('')
  return `<div class="dice dice-${value}" id="${id}">${dots}</div>`
}

function renderBauCuaDice(index, image, alt) {
  return `
    <div class="bau-cua-dice" id="dice${index}">
      <img src="${GAME_CONFIG.BAU_CUA.imageDir}/${image}.png" alt="${alt}" class="bau-cua-img">
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

  rollDice(diceElements, () => {
    diceElements.forEach(dice => {
      const value = Math.floor(Math.random() * 6) + 1
      dice.className = `dice dice-${value}`
      dice.innerHTML = Array.from({ length: value }, () => '<span class="dot"></span>').join('')
    })
  })
}

function rollBauCua() {
  const diceElements = document.querySelectorAll('.bau-cua-container .bau-cua-dice')
  if (!diceElements.length) return

  const images = diceElements.map(dice => dice.querySelector('.bau-cua-img'))

  rollDice(images, () => {
    images.forEach(img => {
      const value = Math.floor(Math.random() * 6)
      img.src = `${GAME_CONFIG.BAU_CUA.imageDir}/${GAME_CONFIG.BAU_CUA.images[value]}`
      img.alt = GAME_CONFIG.BAU_CUA.names[value]
    })
  })
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
