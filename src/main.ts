import { createApp } from 'vue'
import App from './App.vue'
import router from './router.ts'
import './style.css'

const app = createApp(App)

// 使用路由
app.use(router)

// 监听来自父页面的路由导航消息
window.addEventListener('message', (e) => {
  if (e.data?.type === 'NAVIGATE') {
    const targetRoute = e.data.to
    console.log('[WebContainer] Navigating to:', targetRoute)
    router.push(targetRoute).catch((err) => {
      console.warn('[WebContainer] Navigation failed:', err)
    })
  }
})

app.mount('#app') 