# API 参考文档

## 组件API

### GameCanvas.vue

游戏主画布组件

**Props:**
- `width`: number - 画布宽度
- `height`: number - 画布高度

**Events:**
- `@game-start` - 游戏开始事件
- `@game-end` - 游戏结束事件

**Methods:**
- `initCanvas()` - 初始化画布
- `startGameLoop()` - 开始游戏循环
- `stopGameLoop()` - 停止游戏循环

### GameUI.vue

游戏用户界面组件

**Props:**
- `score`: number - 当前分数
- `gameState`: string - 游戏状态

**Events:**
- `@action` - 用户操作事件

**Methods:**
- `getStatusText(status: string)` - 获取状态文本
- `startGame()` - 开始游戏
- `pauseGame()` - 暂停游戏
- `resumeGame()` - 继续游戏
- `restartGame()` - 重新开始游戏

## 核心类API

### GameManager

游戏逻辑主管理器

**Methods:**
- `registerSystem(system: GameSystem)` - 注册游戏系统
- `unregisterSystem(systemName: string)` - 移除游戏系统
- `on(eventType: string, handler: GameEventHandler)` - 注册事件处理器
- `off(eventType: string, handler: GameEventHandler)` - 移除事件处理器
- `emit(eventType: string, data?: any)` - 触发事件
- `setState(newState: GameState)` - 设置游戏状态
- `getState()` - 获取当前游戏状态
- `start()` - 开始游戏
- `pause()` - 暂停游戏
- `stop()` - 停止游戏
- `reset()` - 重置游戏
- `getSystems()` - 获取注册的系统列表
- `getSystem<T>(systemName: string)` - 获取指定系统
- `destroy()` - 销毁游戏管理器

## 接口定义

### GameSystem

```typescript
interface GameSystem {
  name: string
  priority: number
  enabled: boolean
  init(): void
  update(deltaTime: number): void
  render?(ctx: CanvasRenderingContext2D): void
  destroy(): void
}
```

### GameEvent

```typescript
interface GameEvent {
  type: string
  data?: any
  timestamp: number
}
```

### Position

```typescript
interface Position {
  x: number
  y: number
  z?: number
}
```

### GameObject

```typescript
interface GameObject {
  id: string
  position: Position
  velocity?: Position
  size?: Size
  active: boolean
}
```

## 枚举类型

### GameStatus

```typescript
enum GameStatus {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended'
}
```

### EventType

```typescript
enum EventType {
  GAME_START = 'game-start',
  GAME_END = 'game-end',
  SCORE_UPDATE = 'score-update',
  LEVEL_COMPLETE = 'level-complete',
  PLAYER_HIT = 'player-hit',
  OBJECT_COLLISION = 'object-collision'
}
```

## 常量配置

### GAME_CONFIG

```typescript
const GAME_CONFIG = {
  CANVAS: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    FPS: 60
  },
  GAME: {
    INITIAL_SCORE: 0,
    SCORE_INCREMENT: 10,
    MAX_LIVES: 3
  },
  UI: {
    ANIMATION_DURATION: 300,
    Z_INDEX: {
      CANVAS: 1,
      UI_OVERLAY: 10,
      MODAL: 100
    }
  }
}
``` 