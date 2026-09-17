import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/design/tokens.json'), 'utf-8')
);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: [tokens.font.display, 'sans-serif'],
        ui: [tokens.font.ui, 'sans-serif'],
        mono: [tokens.font.mono, 'monospace'],
        tech: [tokens.font.display, tokens.font.ui, 'sans-serif'],
      },
      colors: {
        mx: {
          black: tokens.color.bg || '#000000',
          surface: tokens.color.surface || '#0a0a0a',
          elevated: tokens.color.panel || '#141414',
          panel: tokens.color.panel || '#141414',
          border: tokens.color.border || '#1e1e1e',
          border2: tokens.color['border-hi'] || '#2a2a2a',
          muted: '#6b7280',
          subtle: '#9ca3af',
          text: tokens.color.text || '#ffffff',
          blue: tokens.color.accent || '#3b82f6',
          'blue-dim': '#1e3a5f',
          positive: tokens.semantic.positive || '#22c55e',
          warning: tokens.semantic.warning || '#f59e0b',
          danger: tokens.semantic.danger || '#ef4444',
        },
      },
      borderRadius: {
        none: '0px',
        sm: '6px',
        DEFAULT: '6px',
        md: '10px',
        lg: '14px',
        full: '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
 