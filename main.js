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
      <div class="dice-container" id="diceContainer">
        <div class="dice dice-6" id="dice">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
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
      <div class="dice-container" id="diceContainer">
        ${[1, 2, 3].map(i => `
          <div class="bau-cua-dice" id="dice${i}">
            <img src="/gambling/bau-cua/bau.svg" alt="bầu" class="bau-cua-img">
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function attachEventListeners() {
  const diceContainer = document.getElementById('diceContainer')
  if (!diceContainer) return

  diceContainer.addEventListener('click', () => {
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

  dice.classList.add('rolling')

  setTimeout(() => {
    const value = Math.floor(Math.random() * 6) + 1
    dice.className = `dice dice-${value}`
    dice.classList.remove('rolling')

    // Generate dots based on value
    dice.innerHTML = ''
    for (let i = 0; i < value; i++) {
      const dot = document.createElement('span')
      dot.className = 'dot'
      dice.appendChild(dot)
    }
  }, 600)
}

function rollBauCua() {
  const faceImages = ['bau.svg', 'cua.svg', 'tom.svg', 'ca.svg', 'ga.svg', 'nai.svg']
  const faceNames = ['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai']

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
      img.src = `/gambling/bau-cua/${faceImages[value]}`
      img.alt = faceNames[value]
      img.classList.remove('rolling')
    }
  }, 800)
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
