// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 인증이 필요한 경로(정규식 목록)
const PROTECTED = [/^\/dashboard/, /^\/account/, /^\/settings/]

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // 1) 공격성 헤더 방어: 외부에서 x-middleware-* 헤더가 오면 제거 후 통과
    //    (Next 내부 서브요청에만 필요한 값이므로 외부 유입은 차단/무시)
    const reqHeaders = new Headers(req.headers)
    for (const [k] of reqHeaders) {
        if (k.toLowerCase().startsWith('x-middleware-')) {
            reqHeaders.delete(k)
        }
    }
    const next = NextResponse.next({ request: { headers: reqHeaders } })

    // 2) 보호 경로 접근 제어
    const needsAuth = PROTECTED.some((re) => re.test(pathname))
    if (!needsAuth) return next

    // Supabase Auth 세션 확인
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    )

    try {
        // Authorization 헤더에서 토큰 추출
        const authHeader = req.headers.get('authorization')
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7)
            const { data: { user }, error } = await supabase.auth.getUser(token)
            
            if (user && !error) {
                // 사용자 정보를 헤더에 추가 (선택사항)
                reqHeaders.set('x-user-id', user.id)
                reqHeaders.set('x-user-email', user.email || '')
                return NextResponse.next({ request: { headers: reqHeaders } })
            }
        }

        // 쿠키에서 세션 확인
        const accessToken = req.cookies.get('sb-access-token')?.value
        const refreshToken = req.cookies.get('sb-refresh-token')?.value

        if (accessToken) {
            const { data: { user }, error } = await supabase.auth.getUser(accessToken)
            
            if (user && !error) {
                reqHeaders.set('x-user-id', user.id)
                reqHeaders.set('x-user-email', user.email || '')
                return NextResponse.next({ request: { headers: reqHeaders } })
            }
        }
    } catch (error) {
        console.error('Auth middleware error:', error)
    }

    // API 경로는 401로
    if (pathname.startsWith('/api')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // 그 외 페이지는 로그인으로
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
}

// 정적 파일/Next 내부 자원 등은 제외
export const config = {
    matcher: [
        // 모든 요청 중 다음을 제외:
        '/((?!_next|favicon.ico|robots.txt|sitemap.xml|images|assets|public).*)',
    ],
}
