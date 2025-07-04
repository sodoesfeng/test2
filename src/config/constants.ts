// 游戏常量定义

export const GAME_CONFIG = {
  // 画布相关
  CANVAS: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    FPS: 60
  },
  
  // 游戏逻辑相关
  GAME: {
    INITIAL_SCORE: 0,
    SCORE_INCREMENT: 10,
    MAX_LIVES: 3
  },
  
  // UI相关
  UI: {
    ANIMATION_DURATION: 300,
    Z_INDEX: {
      CANVAS: 1,
      UI_OVERLAY: 10,
      MODAL: 100
    }
  }
} as const

export const COLORS = {
  PRIMARY: '#4CAF50',
  SECONDARY: '#2196F3',
  DANGER: '#f44336',
  WARNING: '#ff9800',
  SUCCESS: '#4CAF50',
  BACKGROUND: '#242424'
} as const 