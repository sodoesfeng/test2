<template>
  <canvas 
    ref="canvasRef"
    class="game-canvas"
    @click="handleCanvasClick"
    @mousemove="handleMouseMove"
    @keydown="handleKeyDown"
    tabindex="0"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GameManager } from '../logic/GameManager'

// Canvas引用
const canvasRef = ref<HTMLCanvasElement>()
const gameManager = ref<GameManager>()

// 初始化游戏
const initGame = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    console.error('无法获取Canvas 2D上下文')
    return
  }

  // 设置canvas尺寸为容器大小
  canvas.width = canvas.offsetWidth || 800
  canvas.height = canvas.offsetHeight || 600

  // 创建游戏管理器
  gameManager.value = new GameManager(canvas, ctx)
  
  console.log('游戏初始化完成')
}

// 事件处理
const handleCanvasClick = (event: MouseEvent) => {
  if (!gameManager.value) return
  
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  gameManager.value.handleClick(x, y)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!gameManager.value) return
  
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  gameManager.value.handleMouseMove(x, y)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!gameManager.value) return
  gameManager.value.handleKeyDown(event.key)
}

// 生命周期
onMounted(() => {
  initGame()
})

onUnmounted(() => {
  if (gameManager.value) {
    gameManager.value.destroy()
  }
})
</script>

<style scoped>
.game-canvas {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  cursor: crosshair;
}
</style> 