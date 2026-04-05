import { gameState } from '../core/state.js'
import { eventManager } from '../core/event-manager.js'
import { renderSmallXucSacDice, renderSmallBauCuaDice } from '../utils/dom.js'
import { GAME_CONFIG } from '../config/game.config.js'

function renderHistoryModal(gameType, history) {
  const gameTitle = gameType === 'xuc-sac' ? 'Xúc Xắc' : 'Bầu Cua'
  const reversedHistory = [...history].reverse()

  const historyItems = reversedHistory.map((roll, index) => {
    const rollNumber = history.length - index
    const time = new Date(roll.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    const dice = gameType === 'xuc-sac'
      ? roll.values.map(v => renderSmallXucSacDice(v)).join('')
      : roll.values.map(v => renderSmallBauCuaDice(v, GAME_CONFIG)).join('')

    return `
      <div class="history-item">
        <div class="history-item-info">
          <span class="history-item-number">#${rollNumber}</span>
          <span class="history-item-time">${time}</span>
        </div>
        <div class="history-item-dice">${dice}</div>
      </div>
    `
  }).join('')

  return `
    <div class="history-modal-overlay">
      <div class="history-modal">
        <div class="history-modal-header">
          <h2>Lịch sử ${gameTitle}</h2>
          <button class="history-close">&times;</button>
        </div>
        <div class="history-modal-content">
          ${historyItems}
        </div>
      </div>
    </div>
  `
}

export function showHistoryModal(gameType) {
  const history = gameState.getHistory(gameType)
  if (!history.length) return

  const modalHTML = renderHistoryModal(gameType, history)
  const modal = document.createElement('div')
  modal.innerHTML = modalHTML
  document.body.appendChild(modal)

  eventManager.on(modal, 'click', (e) => {
    if (e.target === modal || e.target.classList.contains('history-close')) {
      modal.remove()
    }
  })
}
