import { GAME_CONFIG } from '../config/game.config.js'
import { domCache } from '../utils/dom.js'
import { renderHistoryBar } from '../components/history-bar.js'
import { showHistoryModal } from '../components/history-modal.js'
import { rollBauCua } from '../utils/dice-roller.js'
import { eventManager } from '../core/event-manager.js'

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

export function renderBauCua() {
  const diceHTML = Array.from({ length: GAME_CONFIG.BAU_CUA.diceCount }, (_, i) =>
    renderBauCuaDice(i + 1, GAME_CONFIG.BAU_CUA.images[0], GAME_CONFIG.BAU_CUA.names[0])
  ).join('')

  return `
    <div class="container game-page bau-cua-page" id="bau-cuaPage">
      ${renderHistoryBar('bau-cua')}
      <div class="dice-container bau-cua-container" id="diceContainer">
        ${diceHTML}
      </div>
    </div>
  `
}

export function attachBauCuaListeners(shakeCallbackSetter) {
  const bauCuaPage = domCache.get('bau-cuaPage')

  bauCuaPage &&
    eventManager.on(bauCuaPage, 'click', () => {
      rollBauCua()
    })

  shakeCallbackSetter(() => rollBauCua())
}
