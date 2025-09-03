'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'
import type { User, Session } from '@supabase/supabase-js'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setSession, setLoading, clear } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseBrowser.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          clear()
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
        } else {
          clear()
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        clear()
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Auth 상태 변화 리스너
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)

        // 로그인 성공 시
        if (event === 'SIGNED_IN' && session) {
          // 사용자 프로필이 없으면 생성
          await ensureUserProfile(session.user)
          router.refresh()
        }

        // 로그아웃 시
        if (event === 'SIGNED_OUT') {
          clear()
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setLoading, clear, router])

  return <>{children}</>
}

// 사용자 프로필이 없으면 생성하는 함수
async function ensureUserProfile(user: User) {
  try {
    // Prisma를 통해 사용자 프로필 확인/생성
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
      }),
    })

    if (!response.ok) {
      console.error('Failed to ensure user profile:', await response.text())
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error)
  }
}
