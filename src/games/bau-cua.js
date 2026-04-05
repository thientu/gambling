import { GAME_CONFIG } from '../config/game.config.js'
import { domCache } from '../utils/dom.js'
import { renderHistoryBar } from '../components/history-bar.js'
import { showHistoryModal } from '../components/history-modal.js'
import { rollBauCua } from '../utils/dice-roller.js'
import { eventManager } from '../core/event-manager.js'
import { gameState } from '../core/state.js'
import { navigate } from '../core/router.js'

function renderBauCuaDice(index, image, alt, imageType) {
  const faces = GAME_CONFIG.BAU_CUA.names.map((name, i) => {
    if (imageType === GAME_CONFIG.IMAGE_TYPES.EMOJI) {
      return `
        <div class="bau-cua-face bau-cua-face-${i + 1}">
          <span class="bau-cua-emoji">${GAME_CONFIG.BAU_CUA.emojis[i]}</span>
        </div>
      `
    } else {
      return `
        <div class="bau-cua-face bau-cua-face-${i + 1}">
          <img src="${GAME_CONFIG.BAU_CUA.imageDir}/${GAME_CONFIG.BAU_CUA.images[i]}" alt="${name}" class="bau-cua-img">
        </div>
      `
    }
  }).join('')

  return `
    <div class="bau-cua-dice-scene" id="dice${index}Scene">
      <div class="bau-cua-dice" id="dice${index}" data-value="${0}">
        ${faces}
      </div>
    </div>
  `
}

export function renderBauCua() {
  const imageType = gameState.get('bauCua.imageType')
  const diceHTML = Array.from({ length: GAME_CONFIG.BAU_CUA.diceCount }, (_, i) =>
    renderBauCuaDice(i + 1, GAME_CONFIG.BAU_CUA.images[0], GAME_CONFIG.BAU_CUA.names[0], imageType)
  ).join('')

  const currentType = imageType === GAME_CONFIG.IMAGE_TYPES.EMOJI ? 'emoji' : 'svg'

  return `
    <div class="container game-page bau-cua-page" id="bau-cuaPage">
      ${renderHistoryBar('bau-cua')}
      <button class="image-type-toggle" id="imageTypeToggle" data-current="${currentType}">
        <span class="toggle-label">${currentType === 'svg' ? 'SVG' : 'Emoji'}</span>
      </button>
      <div class="dice-container bau-cua-container" id="diceContainer">
        ${diceHTML}
      </div>
    </div>
  `
}

export function attachBauCuaListeners(shakeCallbackSetter) {
  const bauCuaPage = domCache.get('bau-cuaPage')
  const imageTypeToggle = domCache.get('imageTypeToggle')

  bauCuaPage &&
    eventManager.on(bauCuaPage, 'click', (e) => {
      if (e.target.closest('#imageTypeToggle')) return
      rollBauCua()
    })

  imageTypeToggle &&
    eventManager.on(imageTypeToggle, 'click', () => {
      const currentType = gameState.get('bauCua.imageType')
      const newType = currentType === GAME_CONFIG.IMAGE_TYPES.SVG
        ? GAME_CONFIG.IMAGE_TYPES.EMOJI
        : GAME_CONFIG.IMAGE_TYPES.SVG

      gameState.set('bauCua.imageType', newType)
      navigate(window.location.hash)
    })

  shakeCallbackSetter(() => rollBauCua())
}
