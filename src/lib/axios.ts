// src/lib/axios.ts
import axios, { AxiosError } from 'axios'

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

// 요청 인터셉터(필요 시 토큰 등 추가)
api.interceptors.request.use((config) => {
    // 예: const token = getAuthTokenFromStore()
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// 응답 인터셉터: 에러를 일관되게 변환
api.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
        // 여기서 로깅/토스트/라우팅 처리 가능
        return Promise.reject(error)
    }
)

export type ApiError = AxiosError