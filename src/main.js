import '../style.css'
import { init as initRouter, getShakeCallback } from './core/router.js'

const SHAKE_THRESHOLD = 15
const SHAKE_DEBOUNCE = 1000

let lastShakeTime = 0
let isInitialized = false
let permissionRequested = false

async function requestMotionPermission() {
  if (permissionRequested) return true
  permissionRequested = true

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceMotionEvent.requestPermission()
      return permissionState === 'granted'
    } catch (error) {
      console.log('Error requesting device motion permission:', error)
      return false
    }
  }
  return true
}

function handleMotion(event) {
  const acceleration = event.accelerationIncludingGravity
  if (!acceleration) return

  const { x, y, z } = acceleration
  if (!x || !y || !z) return

  const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z)
  const currentTime = Date.now()

  if (accelerationMagnitude > SHAKE_THRESHOLD && currentTime - lastShakeTime > SHAKE_DEBOUNCE) {
    lastShakeTime = currentTime
    const callback = getShakeCallback()
    if (callback) {
      callback()
    }
  }
}

function setupShakeDetection() {
  async function setupHandler() {
    const hasPermission = await requestMotionPermission()
    if (hasPermission && !isInitialized) {
      window.addEventListener('devicemotion', handleMotion)
      isInitialized = true
    }
    document.removeEventListener('click', setupHandler)
    document.removeEventListener('touchstart', setupHandler)
  }

  document.addEventListener('click', setupHandler, { once: true })
  document.addEventListener('touchstart', setupHandler, { once: true })
}

function initApp() {
  initRouter()

  if (window.DeviceMotionEvent) {
    setupShakeDetection()
  }
}

if (document.readyState === 'complete') {
  initApp()
} else {
  window.addEventListener('load', initApp)
}
