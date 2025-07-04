<template>
  <div class="game-container">
    <!-- 游戏画布层 -->
    <GameCanvas />
    <!-- 游戏UI层 (覆盖在画布之上) -->
    <GameUI />
  </div>
</template>

<script setup lang="ts">
import GameCanvas from './canvas/GameCanvas.vue'
import GameUI from './ui/GameUI.vue'
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}
</style> 