'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button, TextField, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { create } from 'zustand'
import clsx from 'clsx'
import { useAuthStore } from '@/store/auth'
import AuthButton from './AuthButton'

// 간단한 Zustand 스토어
type CounterState = {
    count: number
    inc: () => void
    dec: () => void
    reset: () => void
}
const useCounterStore = create<CounterState>((set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
    dec: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
    reset: () => set({ count: 0 }),
}))

// React Hook Form + Zod 스키마
const formSchema = z.object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    email: z.string().email('유효한 이메일을 입력해주세요'),
})
type FormValues = z.infer<typeof formSchema>

// React Query로 샘플 데이터 가져오기
async function fetchTodo() {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    return data as { id: number; title: string; completed: boolean }
}

// Supabase Edge Function(hello) 호출
async function fetchEdgeHello() {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

    const endpoint = isLocal
        ? 'http://localhost:54321/functions/v1/hello'
        : `${baseUrl}/functions/v1/hello`

    const res = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            ...(anon ? { Authorization: `Bearer ${anon}` } : {}),
        },
    })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Edge hello failed: ${res.status} ${text}`)
    }
    return res.json() as Promise<unknown>
}


// ... existing code ...
function LibHealthCheck() {
    const [showAdvanced, setShowAdvanced] = useState(false)
    
    // Zustand 사용
    const { count, inc, dec, reset } = useCounterStore()
    
    // Auth 상태
    const { user, loading: authLoading } = useAuthStore()

    // React Query 사용
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['todo', 1],
        queryFn: fetchTodo,
    })

    // Supabase Edge Function 호출
    const {
        data: hello,
        isFetching: isFetchingHello,
        error: helloError,
        refetch: refetchHello,
    } = useQuery({
        queryKey: ['edge-hello'],
        queryFn: fetchEdgeHello,
        refetchOnWindowFocus: false,
    })

    // Supabase 데이터베이스 연결 테스트 (간단한 버전)
    const {
        data: dbHealth,
        isFetching: isFetchingDb,
        error: dbError,
        refetch: refetchDb,
    } = useQuery({
        queryKey: ['database-health-simple'],
        queryFn: async () => {
            const res = await fetch('/api/health/database-simple', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                const text = await res.text().catch(() => '')
                throw new Error(`Database health check failed: ${res.status} ${text}`)
            }

            return res.json() as Promise<{
                status: 'connected' | 'error'
                tables: Array<{ name: string; count: number }>
                timestamp: string
                error?: string
            }>
        },
        refetchOnWindowFocus: false,
    })

    // RHF + Zod 사용
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset: resetForm,
    } = useForm<FormValues>({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '' },
    })

    const onSubmit = (values: FormValues) => {
        alert(`폼 제출!\nname: ${values.name}\nemail: ${values.email}`)
        resetForm()
    }

    // Dayjs 타임존(Asia/Seoul) 확인 — Providers에서 dayjs 초기화가 수행된 상태를 가정
    const nowKST = dayjs().format('YYYY-MM-DD HH:mm:ss (Z)')

    return (
        <div className="font-sans min-h-screen py-10 px-6 bg-background text-foreground">
            <main className="mx-auto max-w-3xl flex flex-col gap-8">
                <header className="flex items-center gap-4">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={120}
                        height={26}
                        priority
                    />
                    <h1 className="text-2xl font-bold">라이브러리 헬스체크</h1>
                    <Chip label="KST 타임" color="primary" variant="outlined" className="ml-auto" />
                </header>

                {/* Auth 상태 */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Supabase Auth</h2>
                        <span
                            className={clsx(
                                'text-xs rounded-full px-2 py-1',
                                authLoading ? 'bg-yellow-100 text-yellow-800' : 
                                user ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            )}
                        >
                            {authLoading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}
                        </span>
                    </div>
                    
                    {user && (
                        <div className="text-sm space-y-1">
                            <div><strong>이메일:</strong> {user.email}</div>
                            <div><strong>이름:</strong> {user.user_metadata?.name || 'N/A'}</div>
                            <div><strong>역할:</strong> {user.user_metadata?.role || 'CUSTOMER'}</div>
                            <div><strong>가입일:</strong> {new Date(user.created_at).toLocaleDateString('ko-KR')}</div>
                        </div>
                    )}
                    
                    <AuthButton />
                </section>

                {/* Dayjs */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5">
                    <h2 className="text-lg font-semibold mb-3">Dayjs</h2>
                    <p className="text-sm text-muted-foreground">
                        Asia/Seoul 현재 시각: <span className="font-mono">{nowKST}</span>
                    </p>
                </section>

                {/* React Query + axios */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">React Query</h2>
                        <span
                            className={clsx(
                                'text-xs rounded-full px-2 py-1',
                                isFetching ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            )}
                        >
                            {isFetching ? 'Fetching...' : 'Idle'}
                        </span>
                        <Button size="small" variant="outlined" onClick={() => refetch()}>
                            다시 불러오기
                        </Button>
                    </div>

                    {isLoading && <p className="text-sm">불러오는 중...</p>}
                    {error && (
                        <p className="text-sm text-red-600">
                            오류가 발생했습니다: {(error as Error).message}
                        </p>
                    )}
                    {data && (
                        <div className="text-sm">
                            <div>id: {data.id}</div>
                            <div>title: {data.title}</div>
                            <div>completed: {String(data.completed)}</div>
                        </div>
                    )}
                </section>

                {/* Supabase Edge Function */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Supabase Edge Function</h2>
                        <span
                            className={clsx(
                                'text-xs rounded-full px-2 py-1',
                                isFetchingHello ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            )}
                        >
                            {isFetchingHello ? 'Fetching...' : 'Idle'}
                        </span>
                        <Button size="small" variant="outlined" onClick={() => refetchHello()}>
                            호출하기
                        </Button>
                    </div>

                    {helloError && (
                        <p className="text-sm text-red-600">
                            호출 실패: {(helloError as Error).message}
                        </p>
                    )}
                    {!!hello && (
                        <pre className="text-xs bg-black/5 dark:bg-white/10 rounded p-3 overflow-auto">
                            {JSON.stringify(hello, null, 2)}
                        </pre>
                    )}
                    {!hello && !isFetchingHello && !helloError && (
                        <p className="text-sm text-muted-foreground">아직 호출하지 않았습니다. &quot;호출하기&quot;를 눌러보세요.</p>
                    )}
                </section>

                {/* Supabase Database */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Supabase Database</h2>
                        <span
                            className={clsx(
                                'text-xs rounded-full px-2 py-1',
                                isFetchingDb ? 'bg-yellow-100 text-yellow-800' : 
                                dbHealth?.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            )}
                        >
                            {isFetchingDb ? 'Checking...' : 
                             dbHealth?.status === 'connected' ? 'Connected' : 'Error'}
                        </span>
                        <Button size="small" variant="outlined" onClick={() => refetchDb()}>
                            연결 테스트
                        </Button>
                    </div>

                    {dbError && (
                        <p className="text-sm text-red-600">
                            연결 실패: {(dbError as Error).message}
                        </p>
                    )}
                    
                    {dbHealth && (
                        <div className="space-y-3">
                            <div className="text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">상태:</span>
                                    <span className={clsx(
                                        'px-2 py-1 rounded text-xs',
                                        dbHealth.status === 'connected' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    )}>
                                        {dbHealth.status === 'connected' ? '연결됨' : '연결 실패'}
                                    </span>
                                </div>
                                <div className="text-muted-foreground">
                                    마지막 확인: {new Date(dbHealth.timestamp).toLocaleString('ko-KR')}
                                </div>
                            </div>
                            
                            {dbHealth.tables && dbHealth.tables.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">테이블 목록:</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {dbHealth.tables.map((table) => (
                                            <div key={table.name} className="flex justify-between items-center bg-black/5 dark:bg-white/10 rounded px-2 py-1">
                                                <span className="font-mono">{table.name}</span>
                                                <span className="text-muted-foreground">{table.count}개</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {dbHealth.error && (
                                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded p-2">
                                    오류: {dbHealth.error}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!dbHealth && !isFetchingDb && !dbError && (
                        <p className="text-sm text-muted-foreground">아직 연결 테스트를 하지 않았습니다. &quot;연결 테스트&quot;를 눌러보세요.</p>
                    )}
                </section>

                {/* Zustand */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5 space-y-3">
                    <h2 className="text-lg font-semibold">Zustand</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-mono">{count}</span>
                        <Button variant="contained" size="small" onClick={inc}>
                            +1
                        </Button>
                        <Button variant="outlined" size="small" onClick={dec}>
                            -1
                        </Button>
                        <Button variant="text" size="small" onClick={reset}>
                            Reset
                        </Button>
                    </div>
                </section>

                {/* React Hook Form + Zod + MUI */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">React Hook Form + Zod + MUI</h2>
                        <Button
                            size="small"
                            variant={showAdvanced ? 'contained' : 'outlined'}
                            onClick={() => setShowAdvanced((v) => !v)}
                        >
                            {showAdvanced ? '고급 옵션 숨기기' : '고급 옵션 보기'}
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <TextField
                            label="이름"
                            variant="outlined"
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register('name')}
                        />
                        <TextField
                            label="이메일"
                            variant="outlined"
                            size="small"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register('email')}
                        />

                        {showAdvanced && (
                            <div className="text-sm text-muted-foreground">
                                zod로 유효성 검사, @hookform/resolvers 사용 상태를 테스트합니다.
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" variant="contained" disabled={!isValid || isSubmitting}>
                                제출
                            </Button>
                            <Button type="button" variant="outlined" onClick={() => resetForm()} disabled={isSubmitting}>
                                초기화
                            </Button>
                        </div>
                    </form>
                </section>

                {/* Tailwind + MUI 혼용 예시 */}
                <section className="rounded-xl border border-black/10 dark:border-white/15 p-5">
                    <h2 className="text-lg font-semibold mb-3">Tailwind + MUI</h2>
                    <p className="mb-3 text-sm text-muted-foreground">
                        레이아웃/간격 등은 Tailwind, 컴포넌트는 MUI를 사용합니다.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="contained" color="primary">
                            Contained
                        </Button>
                        <Button variant="outlined" color="secondary">
                            Outlined
                        </Button>
                        <Button variant="text">Text</Button>
                    </div>
                </section>

                <footer className="pt-4 text-center text-xs text-muted-foreground">
                    이 페이지는 설치된 라이브러리 동작을 간단히 확인하기 위한 데모입니다.
                </footer>
            </main>
        </div>
    )
}

// 개발 환경에서만 표시하는 래퍼 컴포넌트
export default function LibHealthCheckWrapper() {
    if (process.env.NODE_ENV === 'production') {
        return null
    }
    
    return <LibHealthCheck />
}
// ... existing code ...