/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主题色彩系统
        knowledge: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#7E57C2', // 知识紫
          600: '#7B1FA2',
          700: '#6A1B9A',
          800: '#4A148C',
          900: '#38006B'
        },
        trajectory: {
          50: '#E1F5FE',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6', // 轨迹蓝
          500: '#03A9F4',
          600: '#039BE5',
          700: '#0288D1',
          800: '#0277BD',
          900: '#01579B'
        },
        achievement: {
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFCA28', // 成就金
          600: '#FFC107',
          700: '#FFB300',
          800: '#FFA000',
          900: '#FF8F00'
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          heavy: 'rgba(255, 255, 255, 0.3)'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'particle-float': 'particleFloat 6s ease-in-out infinite',
        'neural-pulse': 'neuralPulse 2s ease-in-out infinite',
        'hologram-wave': 'hologramWave 3s ease-in-out infinite',
        'knowledge-orbit': 'knowledgeOrbit 20s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate'
      },
      keyframes: {
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' }
        },
        neuralPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        hologramWave: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        knowledgeOrbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(126, 87, 194, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(126, 87, 194, 0.8), 0 0 30px rgba(126, 87, 194, 0.6)' }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    },
  },
  plugins: [],
}