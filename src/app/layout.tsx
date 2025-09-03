// app/layout.tsx
import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import './globals.css'

import Providers from './providers' // <- 클라이언트 전용 Providers

export const metadata: Metadata = {
    title: 'Your App',
    description: 'Next.js + Tailwind + MUI + React Query + Zustand',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        {/* 레이아웃은 서버 컴포넌트: 브라우저 훅/상태 사용 X */}
        <body className="min-h-screen bg-background text-foreground antialiased">
        {/* MUI SSR/캐시 어댑터는 레이아웃(서버) 쪽에 두는 것이 권장 */}
        <AppRouterCacheProvider options={{ key: 'mui' }}>
            {/* 클라이언트 전용 Provider 경계 아래로 children을 감쌉니다 */}
            <Providers>{children}</Providers>
        </AppRouterCacheProvider>
        </body>
        </html>
    )
}
