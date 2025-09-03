// src/styles/theme.ts
import { createTheme } from '@mui/material/styles'
import { tokens } from './tokens'

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: tokens.colors.primary },
        secondary: { main: tokens.colors.secondary },
        background: {
            default: tokens.colors.background,
            paper: tokens.colors.surface,
        },
        text: {
            primary: tokens.colors.foreground,
        },
    },
    typography: {
        fontFamily: tokens.fonts.sans,
        h1: { fontWeight: 700, letterSpacing: -0.5 },
        h2: { fontWeight: 700, letterSpacing: -0.25 },
        body1: { lineHeight: 1.6 },
    },
    shape: {
        borderRadius: tokens.radius.lg,
    },
    components: {
        // Tailwind와 역할 분담: 내부 spacing은 sx/variant로, 레이아웃은 Tailwind로
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: tokens.radius.lg,
                },
            },
        },
    },
})
