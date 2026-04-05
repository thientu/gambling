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

export function attachXucSacListeners(shakeCallbackSetter) {
  const decreaseBtn = domCache.get('decreaseDice')
  const increaseBtn = domCache.get('increaseDice')
  const xucSacPage = domCache.get('xuc-sacPage')

  let diceCount = gameState.get('xucSac.diceCount')

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

  xucSacPage &&
    eventManager.on(xucSacPage, 'click', () => {
      rollXucSac()
    })

  shakeCallbackSetter(() => rollXucSac())

  function updateDiceCount(newCount) {
    diceCount = newCount
    gameState.set('xucSac.diceCount', newCount)

    const container = domCache.get('diceContainer')
    if (container) {
      updateDiceDisplay(container, container.children.length, newCount, (i) => renderDice(6, `dice${i}`))
    }
  }
}
