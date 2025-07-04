import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./HomePage.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('./GamePage.vue')
  }
]

// 创建路由实例
export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router