<template>
  <div class="game-ui-overlay">
    <!-- 通用控制面板 -->
    <div class="control-panel">
      <button @click="handleAction('toggle-pause')" class="control-btn">
        {{ isPaused ? '继续' : '暂停' }}
      </button>
      <button @click="handleAction('restart')" class="control-btn">
        重新开始
      </button>
      <button @click="handleAction('menu')" class="control-btn">
        菜单
      </button>
    </div>

    <!-- 信息显示区域 -->
    <div class="info-panel">
      <div class="canvas-info">
        游戏界面
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 本地状态
const isPaused = ref(false)

// 操作处理
const handleAction = (actionType: string) => {
  // 更新本地状态
  if (actionType === 'toggle-pause') {
    isPaused.value = !isPaused.value
  } else if (actionType === 'restart') {
    isPaused.value = false
  }

  // 这里可以添加具体的游戏控制逻辑
  console.log('游戏操作:', actionType)
}
</script>

<style scoped>
.game-ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
}

.control-btn {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.5);
}

.info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  pointer-events: auto;
}

.canvas-info {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}
</style> 