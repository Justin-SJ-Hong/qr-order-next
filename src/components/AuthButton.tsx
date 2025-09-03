'use client'

import { useState } from 'react'
import { Button, TextField, Box, Typography, Alert } from '@mui/material'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'

export default function AuthButton() {
  const { user, loading: authLoading } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // 로그인
        const { error } = await supabaseBrowser.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        // 회원가입
        const { error } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
            }
          }
        })
        if (error) throw error
        setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut()
  }

  if (authLoading) {
    return <Typography>로딩 중...</Typography>
  }

  if (user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2">
          안녕하세요, {user.user_metadata?.name || user.email}님!
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          로그아웃
        </Button>
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleAuth} sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isLogin ? '로그인' : '회원가입'}
      </Typography>
      
      {error && (
        <Alert severity={error.includes('완료') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!isLogin && (
        <TextField
          fullWidth
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          size="small"
        />
      )}

      <TextField
        fullWidth
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        size="small"
        required
      />

      <TextField
        fullWidth
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        size="small"
        required
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 2, mb: 1 }}
      >
        {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={() => setIsLogin(!isLogin)}
        sx={{ mt: 1 }}
      >
        {isLogin ? '회원가입하기' : '로그인하기'}
      </Button>
    </Box>
  )
}
