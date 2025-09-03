// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export function getQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // 서버 데이터 캐싱/리트라이 정책은 팀 컨벤션에 맞게 조정
                staleTime: 1000 * 30,        // 30s
                gcTime: 1000 * 60 * 5,       // 5m (v5의 gcTime)
                refetchOnWindowFocus: false,
                retry: 1,
            },
            mutations: {
                retry: 0,
            },
        },
    })
}
