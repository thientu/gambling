import './style.css'

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

function renderHome() {
  return `
    <div class="container">
      <h1>Chọn Game</h1>
      <div class="game-grid">
        <a href="#xuc-sac" class="game-card">
          <div class="game-icon">🎲</div>
          <h2>Xúc Xắc</h2>
          <p>Lắc một viên xúc xắc</p>
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
  return `
    <div class="container game-page xuc-sac-page" id="xucSacPage">
      <button class="back-btn" onclick="window.location.hash=''">← Quay lại</button>
      <div class="dice-container xuc-sac-container" id="diceContainer">
        <div class="dice dice-6" id="dice">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
      <div class="dice-controls">
        <button class="dice-control-btn" id="decreaseDice">−</button>
        <button class="dice-control-btn" id="increaseDice">+</button>
      </div>
    </div>
  `
}

function renderBauCua() {
  const faces = ['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai']
  const faceImages = ['bau', 'cua', 'tom', 'ca', 'ga', 'nai']
  return `
    <div class="container game-page">
      <button class="back-btn" onclick="window.location.hash=''">← Quay lại</button>
      <div class="dice-container bau-cua-container" id="diceContainer">
        ${[1, 2, 3].map(i => `
          <div class="bau-cua-dice" id="dice${i}">
            <img src="/gambling/bau-cua/bau.png" alt="bầu" class="bau-cua-img">
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function attachEventListeners() {
  const hash = window.location.hash.slice(1)

  if (hash === 'xuc-sac') {
    const xucSacPage = document.getElementById('xucSacPage')
    const decreaseBtn = document.getElementById('decreaseDice')
    const increaseBtn = document.getElementById('increaseDice')

    let diceCount = 1

    decreaseBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (diceCount > 1) {
        diceCount--
        updateDiceDisplay(diceCount)
      }
    })

    increaseBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (diceCount < 3) {
        diceCount++
        updateDiceDisplay(diceCount)
      }
    })

    xucSacPage.addEventListener('click', () => {
      rollXucSac()
    })
  } else if (hash === 'bau-cua') {
    const diceContainer = document.getElementById('diceContainer')
    if (!diceContainer) return

    diceContainer.addEventListener('click', () => {
      rollBauCua()
    })
  }
}

function updateDiceDisplay(count) {
  const container = document.querySelector('.xuc-sac-container')
  container.innerHTML = ''

  for (let i = 0; i < count; i++) {
    const dice = document.createElement('div')
    dice.className = 'dice dice-6'
    dice.id = `dice${i}`
    for (let j = 0; j < 6; j++) {
      const dot = document.createElement('span')
      dot.className = 'dot'
      dice.appendChild(dot)
    }
    container.appendChild(dice)
  }
}

function rollXucSac() {
  const diceElements = document.querySelectorAll('.xuc-sac-container .dice')

  diceElements.forEach(dice => {
    dice.classList.add('rolling')
  })

  setTimeout(() => {
    diceElements.forEach(dice => {
      const value = Math.floor(Math.random() * 6) + 1
      dice.className = `dice dice-${value}`

      dice.innerHTML = ''
      for (let i = 0; i < value; i++) {
        const dot = document.createElement('span')
        dot.className = 'dot'
        dice.appendChild(dot)
      }
    })
  }, 600)
}

function rollBauCua() {
  const templates = ['bau-cua', 'bau-cua-classic']
  const faceImages = ['bau.png', 'cua.png', 'tom.png', 'ca.png', 'ga.png', 'nai.png']
  const faceNames = ['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai']
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)]

  for (let i = 1; i <= 3; i++) {
    const dice = document.getElementById(`dice${i}`)
    const img = dice.querySelector('.bau-cua-img')
    img.classList.add('rolling')
  }

  setTimeout(() => {
    for (let i = 1; i <= 3; i++) {
      const dice = document.getElementById(`dice${i}`)
      const img = dice.querySelector('.bau-cua-img')
      const value = Math.floor(Math.random() * 6)
      img.src = `/gambling/${selectedTemplate}/${faceImages[value]}`
      img.alt = faceNames[value]
      img.classList.remove('rolling')
    }
  }, 800)
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
