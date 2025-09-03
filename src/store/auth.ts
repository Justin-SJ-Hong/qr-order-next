// src/store/auth.ts
import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'

type AuthState = {
    user: User | null
    session: Session | null
    loading: boolean
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    setLoading: (loading: boolean) => void
    clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setLoading: (loading) => set({ loading }),
    clear: () => set({ user: null, session: null, loading: false }),
}))

// 편의 함수들
export const getCurrentUser = () => useAuthStore.getState().user
export const getCurrentSession = () => useAuthStore.getState().session
export const isAuthenticated = () => !!useAuthStore.getState().user
