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
    <div class="container game-page">
      <button class="back-btn" onclick="window.location.hash=''">← Quay lại</button>
      <h1>Xúc Xắc 🎲</h1>
      <div class="dice-container">
        <div class="dice dice-6" id="dice">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
      <button class="roll-btn" id="rollBtn">Quay</button>
      <div class="result" id="result"></div>
    </div>
  `
}

function renderBauCua() {
  const faces = ['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai']
  return `
    <div class="container game-page">
      <button class="back-btn" onclick="window.location.hash=''">← Quay lại</button>
      <h1>Bầu Cua 🎯</h1>
      <div class="dice-container">
        ${[1, 2, 3].map(i => `
          <div class="bau-cua-dice" id="dice${i}">
            <div class="bau-cua-face bau-cua-0"></div>
          </div>
        `).join('')}
      </div>
      <button class="roll-btn" id="rollBtn">Quay</button>
      <div class="result" id="result"></div>
      <div class="bau-cua-legend">
        ${faces.map((face, i) => `<div class="legend-item"><span class="legend-dot"></span>${face}</div>`).join('')}
      </div>
    </div>
  `
}

function attachEventListeners() {
  const rollBtn = document.getElementById('rollBtn')
  if (!rollBtn) return

  rollBtn.addEventListener('click', () => {
    const hash = window.location.hash.slice(1)
    if (hash === 'xuc-sac') {
      rollXucSac()
    } else if (hash === 'bau-cua') {
      rollBauCua()
    }
  })
}

function rollXucSac() {
  const dice = document.getElementById('dice')
  const result = document.getElementById('result')
  const rollBtn = document.getElementById('rollBtn')

  rollBtn.disabled = true
  result.textContent = ''
  dice.classList.add('rolling')

  setTimeout(() => {
    const value = Math.floor(Math.random() * 6) + 1
    dice.className = `dice dice-${value}`
    dice.classList.remove('rolling')
    result.textContent = `Kết quả: ${value}`
    rollBtn.disabled = false
  }, 600)
}

function rollBauCua() {
  const result = document.getElementById('result')
  const rollBtn = document.getElementById('rollBtn')

  rollBtn.disabled = true
  result.textContent = ''

  for (let i = 1; i <= 3; i++) {
    const dice = document.getElementById(`dice${i}`)
    const face = dice.querySelector('.bau-cua-face')
    face.classList.add('rolling')
  }

  setTimeout(() => {
    const results = []
    for (let i = 1; i <= 3; i++) {
      const dice = document.getElementById(`dice${i}`)
      const face = dice.querySelector('.bau-cua-face')
      const value = Math.floor(Math.random() * 6)
      face.className = `bau-cua-face bau-cua-${value}`
      face.classList.remove('rolling')
      results.push(['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai'][value])
    }
    result.textContent = `Kết quả: ${results.join(' - ')}`
    rollBtn.disabled = false
  }, 800)
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
