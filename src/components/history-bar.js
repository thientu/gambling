import { gameState } from '../core/state.js'
import { domCache, renderSmallXucSacDice, renderSmallBauCuaDice } from '../utils/dom.js'
import { GAME_CONFIG } from '../config/game.config.js'

export function renderHistoryBar(gameType) {
  const history = gameState.getHistory(gameType)
  const latestRoll = history.length > 0 ? history[history.length - 1] : null

  if (!latestRoll) {
    return '<div class="history-bar history-empty"><div class="history-label">Chưa có lịch sử</div></div>'
  }

  const smallDice = gameType === 'xuc-sac'
    ? latestRoll.values.map(v => renderSmallXucSacDice(v)).join('')
    : latestRoll.values.map(v => renderSmallBauCuaDice(v, GAME_CONFIG, gameState.get('bauCua.imageType'))).join('')

  return `
    <div class="history-bar" id="historyBar">
      <div class="history-label">Lần trước:</div>
      <div class="history-dice">${smallDice}</div>
    </div>
  `
}

export function updateHistoryBar(gameType) {
  const historyBar = domCache.get('historyBar')
  if (!historyBar) return

  const history = gameState.getHistory(gameType)
  const latestRoll = history.length > 0 ? history[history.length - 1] : null

  if (!latestRoll) {
    historyBar.className = 'history-bar history-empty'
    historyBar.innerHTML = '<div class="history-label">Chưa có lịch sử</div>'
    return
  }

  const smallDice = gameType === 'xuc-sac'
    ? latestRoll.values.map(v => renderSmallXucSacDice(v)).join('')
    : latestRoll.values.map(v => renderSmallBauCuaDice(v, GAME_CONFIG, gameState.get('bauCua.imageType'))).join('')

  historyBar.className = 'history-bar'
  historyBar.innerHTML = `
    <div class="history-label">Lần trước:</div>
    <div class="history-dice">${smallDice}</div>
  `
}
