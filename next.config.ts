// next.config.ts
import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// 간단한 CSP (필요 소스만 추가; inline 스크립트 쓰면 'unsafe-inline' 또는 nonce 필요)
const csp = [
    "default-src 'self'",
    // Next 앱/DevTools/wasm 등 고려해서 최소 허용
    "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: ws:",
    "frame-ancestors 'none'",
    'base-uri \'self\'',
].join('; ')

const securityHeaders = [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
    ...(isProd ? [{ key: 'Content-Security-Policy', value: csp }] : []),
]

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                // 전 경로 공통
                source: '/:path*',
                headers: securityHeaders,
            },
        ]
    },
}

export default nextConfig
