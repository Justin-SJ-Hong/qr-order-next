'use client'

import { useState } from 'react'
import { Button, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material'

export default function TestPage() {
  const [testResults, setTestResults] = useState<{
    database: 'loading' | 'success' | 'error'
    auth: 'loading' | 'success' | 'error'
    overall: 'loading' | 'success' | 'error'
  }>({
    database: 'loading',
    auth: 'loading',
    overall: 'loading'
  })

  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults({
      database: 'loading',
      auth: 'loading',
      overall: 'loading'
    })

    try {
      // 데이터베이스 테스트
      const dbResponse = await fetch('/api/health/database-simple')
      const dbSuccess = dbResponse.ok

      // 인증 테스트 (간단한 API 호출)
      const authResponse = await fetch('/api/auth/profile', { method: 'GET' })
      const authSuccess = authResponse.status !== 500 // 401은 정상 (인증 안됨)

      setTestResults({
        database: dbSuccess ? 'success' : 'error',
        auth: authSuccess ? 'success' : 'error',
        overall: (dbSuccess && authSuccess) ? 'success' : 'error'
      })
    } catch {
      setTestResults({
        database: 'error',
        auth: 'error',
        overall: 'error'
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <span style={{ fontSize: '20px' }}>✅</span>
      case 'error':
        return <span style={{ fontSize: '20px' }}>❌</span>
      case 'loading':
        return <CircularProgress size={20} />
      default:
        return <span style={{ fontSize: '20px' }}>⚠️</span>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '정상 작동'
      case 'error':
        return '문제 발생'
      case 'loading':
        return '확인 중...'
      default:
        return '알 수 없음'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'loading':
        return 'info'
      default:
        return 'warning'
    }
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🚀 앱 상태 확인
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        시스템이 정상적으로 작동하는지 확인합니다
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6">전체 시스템 상태</Typography>
            {getStatusIcon(testResults.overall)}
            <Typography 
              color={`${getStatusColor(testResults.overall)}.main`}
              fontWeight="bold"
            >
              {getStatusText(testResults.overall)}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            onClick={runTests} 
            disabled={isRunning}
            fullWidth
            size="large"
          >
            {isRunning ? '확인 중...' : '시스템 상태 확인하기'}
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">데이터베이스 연결</Typography>
            {getStatusIcon(testResults.database)}
            <Typography color={`${getStatusColor(testResults.database)}.main`}>
              {getStatusText(testResults.database)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            주문 정보, 메뉴 데이터 등을 저장하는 데이터베이스 연결 상태
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">사용자 인증</Typography>
            {getStatusIcon(testResults.auth)}
            <Typography color={`${getStatusColor(testResults.auth)}.main`}>
              {getStatusText(testResults.auth)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            로그인, 회원가입 등 사용자 인증 시스템 상태
          </Typography>
        </CardContent>
      </Card>

      {testResults.overall === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="h6">✅ 모든 시스템이 정상 작동 중입니다!</Typography>
          <Typography variant="body2">
            앱을 안전하게 사용하실 수 있습니다.
          </Typography>
        </Alert>
      )}

      {testResults.overall === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6">⚠️ 일부 시스템에 문제가 있습니다</Typography>
          <Typography variant="body2">
            문제가 지속되면 개발팀에 문의해주세요.
          </Typography>
        </Alert>
      )}
    </Box>
  )
}
