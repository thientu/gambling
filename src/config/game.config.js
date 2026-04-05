export const GAME_CONFIG = {
  ROLL_DURATION: 600,
  XUC_SAC: {
    minDice: 1,
    maxDice: 3,
    defaultDice: 1
  },
  BAU_CUA: {
    diceCount: 3,
    images: ['bau.svg', 'cua.svg', 'tom.svg', 'ca.svg', 'ga.svg', 'nai.svg'],
    names: ['bầu', 'cua', 'tôm', 'cá', 'gà', 'nai'],
    imageDir: '/bau-cua/svg'
  },
  MAX_HISTORY: 50
}

export const DICE_ROTATIONS = {
  xucSac: {
    1: { x: 0, y: 0, z: 0 },
    2: { x: 0, y: 180, z: 0 },
    3: { x: 0, y: -90, z: 0 },
    4: { x: 0, y: 90, z: 0 },
    5: { x: -90, y: 0, z: 0 },
    6: { x: 90, y: 0, z: 0 }
  },
  bauCua: {
    0: { x: 0, y: 0, z: 0 },
    1: { x: 0, y: 180, z: 0 },
    2: { x: 0, y: -90, z: 0 },
    3: { x: 0, y: 90, z: 0 },
    4: { x: -90, y: 0, z: 0 },
    5: { x: 90, y: 0, z: 0 }
  }
}
