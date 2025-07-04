<template>
  <div class="home-container">
    <h1>欢迎来到游戏编辑器</h1>
    <div class="navigation">
      <button @click="goToGame" class="game-button">
        开始游戏
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToGame = () => {
  router.push('/game')
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.navigation {
  margin-top: 2rem;
}

.game-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
</style> 