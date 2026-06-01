import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import fs from 'fs'

// 自签名证书可选：存在则启用 HTTPS（用于本地真机调试麦克风），缺失则降级为 HTTP
const keyPath = resolve(__dirname, 'key.pem')
const certPath = resolve(__dirname, 'cert.pem')
const https =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
    : undefined

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: '方言翻译器',
        short_name: '方言翻译',
        description: '多语言方言翻译工具 - 语音转文本、文本翻译、语音合成',
        theme_color: '#f97316',
        background_color: '#f97316',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] }
    })
  ],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    // 第三方库单独切包，便于浏览器缓存
    rollupOptions: {
      output: {
        manualChunks: { vue: ['vue'] }
      }
    }
  },
  server: {
    port: 3003,
    host: true,
    https,
    headers: {
      'Permissions-Policy': 'microphone=(self)',
      'Access-Control-Allow-Origin': '*'
    }
  }
})
