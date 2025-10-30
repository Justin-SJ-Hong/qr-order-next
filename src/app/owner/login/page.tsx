import { Box, Button, Container, TextField, Typography, Paper, Link as MuiLink } from '@mui/material'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
// ...existing MUI imports

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function loginAction(formData: FormData) {
  'use server'
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null
  if (!email || !password) redirect('/owner/login?error=이메일/비밀번호 입력')

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data?.session) redirect(`/owner/login?error=${encodeURIComponent(error?.message || '로그인 실패')}`)

  const session = data.session
  const cookieStore = await cookies()
  cookieStore.set('sb-access-token', session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: session.expires_in,
  })

  redirect('/owner/menu-board')
}

export default function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" gutterBottom align="center" fontWeight="bold">로그인</Typography>

          <form action={loginAction}>
            <TextField name="email" label="이메일" type="email" fullWidth margin="normal" required />
            <TextField name="password" label="비밀번호" type="password" fullWidth margin="normal" required />
            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3 }}>로그인</Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                계정이 없으신가요? <MuiLink component={Link} href="/owner/signup" underline="hover">회원가입</MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}