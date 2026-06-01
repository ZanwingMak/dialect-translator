/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // iOS 26 液态玻璃配色：以暖橙为品牌色，文字走深 stone（比纯黑柔和）
      colors: {
        ink: {
          base: '#1c1917', // 主文字（stone-900）
          dim: '#44403c', // 次要文字（stone-700）
          muted: '#78716c', // 辅助文字（stone-500）
          faint: '#a8a29e' // 占位 / 失活（stone-400）
        },
        accent: {
          DEFAULT: '#007AFF', // iOS System Blue
          hover: '#3395ff', // 悬停亮一档
          ring: 'rgba(0,122,255,0.35)'
        },
        // 录音激活仍使用暖橙：录音的视觉语义共识
        record: '#ff6b35',
        danger: '#ff3b30' // iOS System Red
      },
      fontFamily: {
        // 优先 SF Pro（iOS/macOS 原生），其次 Geist
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Geist',
          '"Segoe UI"',
          'sans-serif'
        ],
        mono: ['"SF Mono"', '"Geist Mono"', 'ui-monospace', 'monospace']
      },
      // 液态玻璃专属阴影：组合内白高光 + 外环暗影
      boxShadow: {
        // 主玻璃面板：上沿一道白色亮边 + 大范围柔阴影（阴影偏冷蓝）
        'glass': '0 1px 0 0 rgba(255,255,255,0.7) inset, 0 8px 32px -8px rgba(20,30,60,0.16), 0 2px 8px -2px rgba(20,30,60,0.08)',
        // 玻璃按钮：更轻更紧凑
        'glass-btn': '0 1px 0 0 rgba(255,255,255,0.6) inset, 0 4px 12px -4px rgba(20,30,60,0.12)',
        // 凸起按钮（如 CTA）：System Blue 发光
        'glow-accent': '0 1px 0 0 rgba(255,255,255,0.4) inset, 0 8px 24px -6px rgba(0,122,255,0.5)'
      },
      animation: {
        breathe: 'breathe 2.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        // 背景色球缓慢漂浮
        'float-slow': 'float 18s ease-in-out infinite',
        'float-slower': 'float 26s ease-in-out infinite reverse'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0.55), 0 8px 32px -4px rgba(255,107,53,0.4)' },
          '50%': { boxShadow: '0 0 0 18px rgba(255,107,53,0), 0 8px 32px -4px rgba(255,107,53,0.5)' }
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-30px, 20px) scale(0.95)' }
        }
      }
    }
  },
  plugins: []
}
