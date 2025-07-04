// TypeScript 接口定义
import { GameStatus } from './enums'

export interface GameState {
  score: number
  lives: number
  level: number
  status: GameStatus
}

export interface Position {
  x: number
  y: number
  z?: number
}

export interface Size {
  width: number
  height: number
}

export interface GameConfig {
  canvas: Size
  fps: number
  difficulty: 'easy' | 'normal' | 'hard'
}

export interface UIAction {
  type: string
  payload?: any
  timestamp?: number
}

export interface GameObject {
  id: string
  position: Position
  velocity?: Position
  size?: Size
  active: boolean
}

export interface GameSystem {
  name: string
  priority: number
  enabled: boolean
  init(): void
  update(deltaTime: number): void
  render?(ctx: CanvasRenderingContext2D): void
  destroy(): void
}

export interface InputState {
  mouse: {
    x: number
    y: number
    pressed: boolean
    button: number
  }
  keyboard: {
    pressed: Set<string>
    justPressed: Set<string>
    justReleased: Set<string>
  }
} 