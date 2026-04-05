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
  const shakeLocked = gameState.get('bauCua.shakeLocked')
  const lockIcon = shakeLocked ? '🔒' : '🔓'
  const diceHTML = Array.from({ length: GAME_CONFIG.BAU_CUA.diceCount }, (_, i) =>
    renderBauCuaDice(i + 1, GAME_CONFIG.BAU_CUA.images[0], GAME_CONFIG.BAU_CUA.names[0], imageType)
  ).join('')

  const currentType = imageType === GAME_CONFIG.IMAGE_TYPES.EMOJI ? 'emoji' : 'image'

  return `
    <div class="container game-page bau-cua-page" id="bau-cuaPage">
      ${renderHistoryBar('bau-cua')}
      <div class="dice-controls">
        <button class="dice-control-btn shake-lock-btn" id="shakeLock">${lockIcon}</button>
        <button class="image-type-toggle" id="imageTypeToggle" data-current="${currentType}">
          <span class="toggle-label">${currentType === 'image' ? 'Image' : 'Emoji'}</span>
        </button>
      </div>
      <div class="dice-container bau-cua-container" id="diceContainer">
        ${diceHTML}
      </div>
    </div>
  `
}

let isScreenPressed = false

export function attachBauCuaListeners(shakeCallbackSetter) {
  const bauCuaPage = domCache.get('bau-cuaPage')
  const shakeLockBtn = domCache.get('shakeLock')
  const imageTypeToggle = domCache.get('imageTypeToggle')

  const handlePressStart = () => { isScreenPressed = true }
  const handlePressEnd = () => { isScreenPressed = false }

  document.addEventListener('mousedown', handlePressStart)
  document.addEventListener('mouseup', handlePressEnd)
  document.addEventListener('touchstart', handlePressStart)
  document.addEventListener('touchend', handlePressEnd)

  shakeLockBtn &&
    eventManager.on(shakeLockBtn, 'click', (e) => {
      e.stopPropagation()
      const currentLocked = gameState.get('bauCua.shakeLocked')
      const newLocked = !currentLocked
      gameState.set('bauCua.shakeLocked', newLocked)
      shakeLockBtn.textContent = newLocked ? '🔒' : '🔓'
    })

  const shouldPreventRoll = (e) => {
    return e.target.closest('#imageTypeToggle') ||
           e.target.closest('#historyBar') ||
           document.querySelector('.history-modal-overlay')
  }

  bauCuaPage &&
    eventManager.on(bauCuaPage, 'click', (e) => {
      if (shouldPreventRoll(e)) return
      rollBauCua()
    })

  shakeCallbackSetter(() => {
    if (document.querySelector('.history-modal-overlay')) return
    if (isScreenPressed) return
    if (!gameState.get('bauCua.shakeLocked')) return
    rollBauCua()
  })

  imageTypeToggle &&
    eventManager.on(imageTypeToggle, 'click', () => {
      const currentType = gameState.get('bauCua.imageType')
      const newType = currentType === GAME_CONFIG.IMAGE_TYPES.IMAGE
        ? GAME_CONFIG.IMAGE_TYPES.EMOJI
        : GAME_CONFIG.IMAGE_TYPES.IMAGE

      gameState.set('bauCua.imageType', newType)
      navigate(window.location.hash)
    })
}
