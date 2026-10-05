import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg:      '#0c0c0c',
        card:    '#141414',
        card2:   '#1c1c1c',
        accent:  '#e8ff00',
        muted:   '#666666',
        dim:     '#3a3a3a',
        border:  'rgba(255,255,255,0.07)',
      },
      letterSpacing: {
        tighter2: '-0.04em',
        tight2:   '-0.025em',
      },
      animation: {
        'marquee':     'marquee 32s linear infinite',
        'marquee-rev': 'marqueeRev 32s linear infinite',
        'blink':       'blink 2s ease-in-out infinite',
        'scroll-drop': 'scrollDrop 2.2s ease-in-out infinite',
        'fade-in':     'fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        marquee:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        marqueeRev: { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        blink: {
          '0%,100%': { boxShadow: '0 0 6px #00e676' },
          '50%':     { boxShadow: '0 0 16px #00e676, 0 0 28px #00e676' },
        },
        scrollDrop: {
          '0%':   { transform: 'scaleY(0)', transformOrigin: 'top', opacity: '1' },
          '60%':  { transform: 'scaleY(1)', transformOrigin: 'top', opacity: '1' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom', opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
