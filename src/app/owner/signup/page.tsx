import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Container, Box, Paper, Typography, TextField, Button, MenuItem, Stack } from '@mui/material'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const signUpAction = async (formData: FormData) => {
  'use server'

  const name = (formData.get('name') as string | null) || ''
  const email = (formData.get('email') as string | null) || ''
  const password = formData.get('password') as string | null
  const role = (formData.get('role') as string | null) || 'OWNER'

  if (!email || !password) redirect('/owner/signup')
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // 회원가입: 여기서는 아직 상대경로(storagePath) 넣고 있음
  const { data: signUpData, error: signUpError } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          role,
        },
      },
    })

  if (signUpError) redirect('/owner/signup')

  // 이메일 인증이 필요한 상태라면 여기서 return돼버리므로
  // 아직 업로드/DB upsert 안 된 상태임
  if (!signUpData.session || !signUpData.user) {
    redirect('/owner/login?confirm=1')
  }

  // 세션 있는 인증 supabase client
  const authenticated = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${signUpData.session.access_token}`,
      },
    },
  })

  // ✅ profile.avatar_path 에 "절대 URL" 직접 저장
  await authenticated.from('profile').upsert(
    {
      id: signUpData.user.id,
      name: name || email.split('@')[0],
      email,
      role,
    },
    { onConflict: 'id' }
  )

  redirect('/owner/menu-board')
}


export default function SignupPage() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" gutterBottom align="center" fontWeight="bold">회원가입</Typography>

          <form action={signUpAction}>
            <Stack spacing={2}>
              <TextField name="name" label="이름" fullWidth />
              <TextField name="role" label="역할" select fullWidth defaultValue="OWNER">
                <MenuItem value="OWNER">사장님</MenuItem>
                <MenuItem value="MANAGER">관리자</MenuItem>
              </TextField>
              <TextField name="email" label="이메일" type="email" fullWidth required />
              <TextField name="password" label="비밀번호" type="password" fullWidth required />

              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1 }}>
                회원가입
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}