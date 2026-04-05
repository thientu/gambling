import { GAME_CONFIG, DICE_ROTATIONS } from '../config/game.config.js'
import { gameState } from '../core/state.js'
import { updateHistoryBar } from '../components/history-bar.js'

export function rollDice({ containerSelector, rotationMapping, valueRange, gameType }) {
  const diceElements = document.querySelectorAll(containerSelector)
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
      const [min, max] = valueRange
      const value = Math.floor(Math.random() * (max - min + 1)) + min
      values.push(value)

      const rotations = rotationMapping[value]
      const extraRotations = {
        x: Math.floor(Math.random() * 6 + 3) * 360,
        y: Math.floor(Math.random() * 6 + 3) * 360,
        z: Math.floor(Math.random() * 4 + 2) * 360
      }

      dice.style.transform = `rotateX(${rotations.x + extraRotations.x}deg) rotateY(${rotations.y + extraRotations.y}deg) rotateZ(${rotations.z + extraRotations.z}deg)`
      dice.setAttribute('data-value', value)
    })

    gameState.addHistory(gameType, values)
    updateHistoryBar(gameType)
  }, GAME_CONFIG.ROLL_DURATION)
}

export function rollXucSac() {
  rollDice({
    containerSelector: '.xuc-sac-container .dice',
    rotationMapping: DICE_ROTATIONS.xucSac,
    valueRange: [1, 6],
    gameType: 'xuc-sac'
  })
}

export function rollBauCua() {
  rollDice({
    containerSelector: '.bau-cua-container .bau-cua-dice',
    rotationMapping: DICE_ROTATIONS.bauCua,
    valueRange: [0, 5],
    gameType: 'bau-cua'
  })
}
