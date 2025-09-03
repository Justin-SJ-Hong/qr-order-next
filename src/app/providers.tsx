// app/providers.tsx
'use client'

import type { PropsWithChildren } from 'react'
import { useState, useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { theme } from '@/styles/theme'
import AuthProvider from '@/components/AuthProvider'
import '@/lib/dayjs' // dayjs 타임존 초기화(Asia/Seoul)

// ... existing code ...
export default function Providers({ children }: PropsWithChildren) {
    // QueryClient는 클라이언트에서 1회 생성
    const [queryClient] = useState(getQueryClient)

    // (선택) 클라이언트 전용 초기화가 더 있다면 여기서 처리
    useEffect(() => {
        // 예: Sentry init, analytics 허용 시점 등
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                    {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
                </AuthProvider>
            </QueryClientProvider>
            {/* Zustand는 기본적으로 Provider 불필요 — 훅을 컴포넌트에서 직접 사용 */}
        </ThemeProvider>
    )
}
// ... existing code ...