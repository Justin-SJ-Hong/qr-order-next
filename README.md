# QR-Order (Next.js + Supabase)

Next.js, Supabase(Auth/DB/Functions/Storage), Prisma, React Query, MUI로 만든 QR 주문 앱입니다.

## 개요

- Next.js App Router 기반(Server Components + Client Providers)
- Supabase: 인증, PostgreSQL, Edge Functions, Storage 사용
- 서버/관리 작업은 Prisma ORM 사용
- 데이터 페칭/캐싱은 React Query 사용
- UI는 Tailwind + MUI 혼용

## 기술 스택

- Next.js 15 (Turbopack), TypeScript
- Supabase (Auth/DB/Functions/Storage)
- Prisma 6, PostgreSQL
- @tanstack/react-query, Axios
- Tailwind CSS, MUI

## 요구 사항

- Node.js LTS (v18+)
- Supabase CLI
- Docker (로컬 Supabase용)

## 로컬 실행 방법

1) 의존성 설치

```bash
npm install
```

2) Supabase 로컬 실행

```bash
supabase start
supabase status  # URL/Key 확인
```

3) 환경변수 설정

로컬 개발용 `.env` 생성:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase status로 확인한 local anon key>"
```

프로덕션(Vercel)용 `.env.production` 생성:

```env
DATABASE_URL="postgresql://postgres:<PASSWORD>@db.<PROJECT-REF>.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://<PROJECT-REF>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon key>"
SUPABASE_SERVICE_ROLE="<service role key>"  # 서버 전용
NODE_ENV=production
```

4) 앱 실행

```bash
npm run dev
# http://localhost:3000 (점유 시 3001)
```

## 환경변수 목록

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE (서버 전용)
- DATABASE_URL (Postgres 직접 URL)
- NODE_ENV

## 데이터베이스 & Prisma

- Prisma 클라이언트 생성

```bash
npx prisma generate
```

- 로컬 개발(스키마를 로컬 DB에 적용):

```bash
npx prisma migrate dev --name init
```

- DB에서 Prisma로 스키마 가져오기(Introspect):

```bash
npx prisma db pull
```

메모:
- Prisma는 서버(Node 런타임)에서만 사용하세요. Edge 런타임에서는 미지원.
- 클라이언트/RLS 기반 흐름은 Prisma 대신 `@supabase/supabase-js` 사용을 권장.

## Supabase

### Edge Functions

- 로컬 실행:

```bash
supabase functions serve hello --no-verify-jwt
```

- 원격 배포:

```bash
supabase functions deploy hello
```

### DB 마이그레이션 동기화(CLI)

```bash
supabase db pull --linked
supabase db push --linked   # 주의해서 사용; 대상 프로젝트 확인 필수
```

## 인증(Auth)

- 기본: 이메일/비밀번호 (OAuth 선택적)
- 인증 상태는 `AuthProvider` + `useAuthStore`에서 관리
- 보호 경로는 `middleware.ts`로 강제
- 프로필 부트스트랩: `/api/auth/profile`

## 데이터 접근 경계

- Prisma: 서버 전용(관리/복잡 쿼리/RLS 우회는 service_role로)
- supabase-js: RLS 하의 단순 CRUD/Auth/Storage/Realtime/Functions (클라이언트/서버 모두)
- Edge 런타임 엔드포인트: Prisma 미사용(미지원); supabase-js 사용

## 스토리지

- 버킷: `public`(공개 읽기), `private`(서명 URL로 읽기)
- 권장 정책:
  - public: 읽기 공개, 쓰기는 인증 사용자/역할 제한
  - private: 소유자 기준 읽기/쓰기, 다운로드는 signed URL
- 경로 규칙: `<entity>/<entityId>/<uuid>.<ext>`

## 배포(Vercel)

1) Vercel 프로젝트 생성 후 레포 연결
2) 환경변수(Production/Preview)에 다음 추가:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE (암호화됨)
   - DATABASE_URL
   - NODE_ENV=production
3) Supabase 대시보드 → Auth 설정:
   - site_url: `https://<your-domain>`
   - additional redirect URLs: Vercel preview/prod 도메인 포함
4) Edge Functions CORS: Vercel 도메인 허용
5) Deploy

## 문제 해결(Troubleshooting)

- “Remote DB up to date지만 테이블이 안 보임”
  - 올바른 프로젝트에 푸시했는지(Linked ref) 확인
  - 필요 시 SQL Editor로 직접 적용
- Prisma가 Supabase에 연결 실패
  - `DATABASE_URL` 확인 및 네트워크/방화벽 이슈 점검
- 미들웨어로 접근이 막힘
  - `sb-access-token` 쿠키 존재 확인, 정적 자원 매처 제외 확인

## 스크립트

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio"
}
```