// src/styles/tokens.ts
export const tokens = {
    colors: {
        primary: '#1976d2',
        secondary: '#9c27b0',
        background: '#ffffff',    // 라이트 모드 배경
        surface: '#ffffff',       // 카드/페이퍼 배경
        foreground: '#0f172a',    // 본문 텍스트
    },
    fonts: {
        // Tailwind의 font-sans와 논리적으로 일치시키기
        sans: [
            'Inter',
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            '"Noto Sans"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
        ].join(', '),
    },
    radius: {
        lg: 12,
    },
}
