'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth'

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

        if (event === 'SIGNED_IN') {
          router.refresh()
        }

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
