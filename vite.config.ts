import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: { 
    target: 'ES2023'
  },
  esbuild: {
    target: 'ES2023'
  },
  server: {
    host: true,
    port: 5173
  }
}) 