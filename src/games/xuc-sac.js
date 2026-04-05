import { GAME_CONFIG } from '../config/game.config.js'
import { gameState } from '../core/state.js'
import { eventManager } from '../core/event-manager.js'
import { domCache, renderDice, updateDiceDisplay } from '../utils/dom.js'
import { renderHistoryBar } from '../components/history-bar.js'
import { showHistoryModal } from '../components/history-modal.js'
import { rollXucSac } from '../utils/dice-roller.js'

export function renderXucSac() {
  const diceCount = gameState.get('xucSac.diceCount')
  const diceHTML = Array.from({ length: diceCount }, (_, i) =>
    renderDice(6, `dice${i}`)
  ).join('')

  return `
    <div class="container game-page xuc-sac-page" id="xuc-sacPage">
      ${renderHistoryBar('xuc-sac')}
      <div class="dice-controls">
        <button class="dice-control-btn" id="decreaseDice">−</button>
        <button class="dice-control-btn" id="increaseDice">+</button>
      </div>
      <div class="dice-container xuc-sac-container" id="diceContainer">
        ${diceHTML}
      </div>
    </div>
  `
}

let isScreenPressed = false

export function attachXucSacListeners(shakeCallbackSetter) {
  const decreaseBtn = domCache.get('decreaseDice')
  const increaseBtn = domCache.get('increaseDice')
  const xucSacPage = domCache.get('xuc-sacPage')

  let diceCount = gameState.get('xucSac.diceCount')

  const handlePressStart = () => { isScreenPressed = true }
  const handlePressEnd = () => { isScreenPressed = false }

  document.addEventListener('mousedown', handlePressStart)
  document.addEventListener('mouseup', handlePressEnd)
  document.addEventListener('touchstart', handlePressStart)
  document.addEventListener('touchend', handlePressEnd)

  decreaseBtn &&
    eventManager.on(decreaseBtn, 'click', (e) => {
      e.stopPropagation()
      if (diceCount > GAME_CONFIG.XUC_SAC.minDice) {
        diceCount--
        updateDiceCount(diceCount)
      }
    })

  increaseBtn &&
    eventManager.on(increaseBtn, 'click', (e) => {
      e.stopPropagation()
      if (diceCount < GAME_CONFIG.XUC_SAC.maxDice) {
        diceCount++
        updateDiceCount(diceCount)
      }
    })

  const shouldPreventRoll = (e) => {
    return e.target.closest('#historyBar') ||
           e.target.closest('#decreaseDice') ||
           e.target.closest('#increaseDice') ||
           document.querySelector('.history-modal-overlay')
  }

  xucSacPage &&
    eventManager.on(xucSacPage, 'click', (e) => {
      if (shouldPreventRoll(e)) return
      rollXucSac()
    })

  shakeCallbackSetter(() => {
    if (document.querySelector('.history-modal-overlay')) return
    if (isScreenPressed) return
    rollXucSac()
  })

  function updateDiceCount(newCount) {
    diceCount = newCount
    gameState.set('xucSac.diceCount', newCount)

    const container = domCache.get('diceContainer')
    if (container) {
      updateDiceDisplay(container, container.children.length, newCount, (i) => renderDice(6, `dice${i}`))
    }
  }
}
