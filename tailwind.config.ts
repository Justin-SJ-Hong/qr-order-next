// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { tokens } from '@/styles/tokens' // 공용 색상/타이포 토큰

const config: Config = {
    // v3/v4 모두 동작하도록 content 경로 명시
    content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: tokens.colors.primary,       // '#1976d2'
                secondary: tokens.colors.secondary,   // '#9c27b0'
                background: tokens.colors.background, // '#ffffff' or '#0b1220'
                foreground: tokens.colors.foreground, // '#0f172a'
            },
            borderRadius: {
                '2xl': '1rem',
            },
            fontFamily: {
                sans: tokens.fonts.sans, // Tailwind font-sans와 일치
            },
        },
    },
    // MUI 내부 스타일보다 Tailwind 유틸의 우선순위를 안정적으로 높이고 싶다면:
    // important: '#__next',
}
export default config
