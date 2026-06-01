/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 应用专属设计 token，避免在组件里散落 hex
      colors: {
        ink: {
          base: '#0a0a0b', // 主背景：略偏蓝的近黑（不用纯黑）
          raised: '#131316', // 浮起卡片
          sunken: '#08080a', // 凹陷（input 等）
          border: 'rgba(255,255,255,0.06)',
          'border-strong': 'rgba(255,255,255,0.1)',
          text: '#fafafa',
          dim: '#a1a1aa',
          muted: '#52525b',
          faint: '#3f3f46'
        },
        accent: {
          DEFAULT: '#f59e0b', // 暖橙：继承品牌但低饱和（amber-500）
          hover: '#fbbf24',
          soft: 'rgba(245,158,11,0.12)',
          ring: 'rgba(245,158,11,0.35)'
        },
        danger: '#f43f5e'
      },
      fontFamily: {
        // Geist 通过 Google Fonts 加载；fallback 到系统字体
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(245,158,11,0.35), 0 0 32px -8px rgba(245,158,11,0.4)',
        elev: '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.6)'
      },
      animation: {
        breathe: 'breathe 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,158,11,0.45)' },
          '50%': { boxShadow: '0 0 0 16px rgba(245,158,11,0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
