import { gameState } from './state.js'
import { domCache } from '../utils/dom.js'
import { eventManager } from './event-manager.js'
import { showHistoryModal } from '../components/history-modal.js'
import { renderHome } from '../views/home.js'
import { renderXucSac, attachXucSacListeners } from '../games/xuc-sac.js'
import { renderBauCua, attachBauCuaListeners } from '../games/bau-cua.js'

const routes = {
  '': renderHome,
  'xuc-sac': renderXucSac,
  'bau-cua': renderBauCua
}

let currentShakeCallback = null

function setShakeCallback(callback) {
  currentShakeCallback = callback
}

function getShakeCallback() {
  return currentShakeCallback
}

function navigate(hash) {
  cleanup()

  const route = hash.slice(1)
  const renderer = routes[route] || renderHome
  const app = document.querySelector('#app')

  console.log('[Router] Navigation:', { hash, route, hasRenderer: !!renderer, hasApp: !!app })

  if (app) {
    const html = renderer()
    console.log('[Router] HTML length:', html?.length || 0)
    app.innerHTML = html
  } else {
    console.error('[Router] #app element not found!')
  }

  domCache.invalidate()
  gameState.set('currentRoute', route)

  attachEventListeners(route)
}

function cleanup() {
  eventManager.cleanup()
  domCache.invalidate()
}

function attachEventListeners(route) {
  if (route === 'xuc-sac') {
    attachXucSacListeners(setShakeCallback)
  } else if (route === 'bau-cua') {
    attachBauCuaListeners(setShakeCallback)
  }

  const historyBar = domCache.get('historyBar')
  if (historyBar) {
    eventManager.delegate(document.body, 'click', '#historyBar', () => {
      const gameType = route === 'xuc-sac' ? 'xuc-sac' : 'bau-cua'
      showHistoryModal(gameType)
    })
  }
}

function init() {
  window.addEventListener('hashchange', () => navigate(window.location.hash))
  navigate(window.location.hash)
}

export { init, navigate, setShakeCallback, getShakeCallback }
