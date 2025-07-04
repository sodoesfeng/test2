// 枚举定义

export enum GameStatus {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended'
}

export enum InputType {
  MOUSE = 'mouse',
  KEYBOARD = 'keyboard',
  TOUCH = 'touch'
}

export enum SoundType {
  SFX = 'sfx',
  MUSIC = 'music',
  VOICE = 'voice'
}

export enum ObjectType {
  PLAYER = 'player',
  ENEMY = 'enemy',
  PROJECTILE = 'projectile',
  PICKUP = 'pickup',
  ENVIRONMENT = 'environment'
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}

export enum EventType {
  GAME_START = 'game-start',
  GAME_END = 'game-end',
  SCORE_UPDATE = 'score-update',
  LEVEL_COMPLETE = 'level-complete',
  PLAYER_HIT = 'player-hit',
  OBJECT_COLLISION = 'object-collision'
} 