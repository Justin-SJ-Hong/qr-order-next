import { create } from 'zustand'
import { supabaseBrowser } from '@/lib/supabase/client'

type UserMini = {
  id: string
  name: string
  email: string
  avatar_url?: string
}

type RegisterInput = {
  email: string
  password: string
  name?: string
  role: 'OWNER' | 'MANAGER'
}

let _hasHydratedFromServer = false

type RegisterState = {
  user: UserMini | null
  loading: boolean
  error: string | null

  // avatar is managed in store
  avatar: File | null
  setAvatar: (file: File | null) => void

  /** SSR에서 가져온 유저 스냅샷을 클라이언트 최초 마운트 시 주입 */
  hydrateFromServer: (initialUser: UserMini | null) => void

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (input: RegisterInput) => Promise<{ confirmRequired?: boolean }>
  updateAvatar: (file: File) => Promise<void>
  removeAvatar: () => Promise<void>
  updateProfile: (fields: { name?: string; role?: 'OWNER' | 'MANAGER' }) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
  clearError: () => void
}

export const useRegisterStore = create<RegisterState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  avatar: null,
  setAvatar: (file) => set({ avatar: file }),

  hydrateFromServer: (initialUser) => {
    if (_hasHydratedFromServer) return
    _hasHydratedFromServer = true
    set({ user: initialUser })
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data.user) {
        // 세션 쿠키 저장 (미들웨어 보호용)
        try {
          const session = data.session || (await supabaseBrowser.auth.getSession()).data.session
          if (session?.access_token && typeof document !== 'undefined') {
            const maxAge = session.expires_in ?? 60 * 60 * 24 * 7
            document.cookie = `sb-access-token=${session.access_token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
          }
        } catch {}

        // 선택: 프로필 fetch 후 최소 정보 저장
        const { data: profile } = await supabaseBrowser
          .from('profile')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const bucketBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`
        const derivedAvatarUrl = (profile as { avatar_path?: string })?.avatar_path
          ? `${bucketBase}${(profile as { avatar_path?: string }).avatar_path}`
          : undefined

        set({
          user: profile
            ? {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                ...(derivedAvatarUrl ? { avatar_url: derivedAvatarUrl } : {}),
              }
            : { id: data.user.id, name: data.user.user_metadata?.name ?? email.split('@')[0], email },
          loading: false,
        })
      } else {
        set({ loading: false })
      }
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Login failed', loading: false })
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      await supabaseBrowser.auth.signOut()
      if (typeof document !== 'undefined') {
        document.cookie = 'sb-access-token=; Path=/; Max-Age=0; SameSite=Lax'
      }
      set({ user: null, loading: false })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Logout failed', loading: false })
    }
  },

  register: async ({ email, password, name, role }) => {
    set({ loading: true, error: null })
    try {
      // 1) 회원가입
      const { data, error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || email.split('@')[0], role },
        },
      })
      if (error) throw error

      // 이메일 인증 on → 세션/유저 없음
      if (!data.session || !data.user) {
        set({ loading: false })
        return { confirmRequired: true }
      }

      const user = data.user

      // 2) 프로필 upsert (회원가입 시 아바타 처리 없음)
      const { error: upsertErr } = await supabaseBrowser.from('profile').upsert(
        {
          id: user.id,
          name: name || email.split('@')[0],
          email,
          role,
        },
        { onConflict: 'id' }
      )
      if (upsertErr) throw upsertErr

      // 세션 쿠키 저장 (미들웨어 보호용)
      try {
        const session = data.session || (await supabaseBrowser.auth.getSession()).data.session
        if (session?.access_token && typeof document !== 'undefined') {
          const maxAge = session.expires_in ?? 60 * 60 * 24 * 7
          document.cookie = `sb-access-token=${session.access_token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
        }
      } catch {}

      // 3) 상태 업데이트 (아바타 필드 제외)
      set({
        user: {
          id: user.id,
          name: name || email.split('@')[0] || '',
          email,
        },
        loading: false,
        avatar: null,
      })

      return {}
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Registration failed', loading: false })
      throw e
    }
  },

  updateAvatar: async (file: File) => {
    const { user } = get()
    if (!user) return
  
    const ext = file.name.split('.')?.pop()?.toLowerCase() || 'jpg'
    const path = `users/${user.id}/${Date.now()}.${ext}`
  
    const { error: uploadError } = await supabaseBrowser.storage
      .from('avatars')           // avatars 버킷
      .upload(path, file, { upsert: true })
    if (uploadError) throw uploadError
  
    const { error } = await supabaseBrowser
      .from('profile')
      .update({ avatar_path: path })
      .eq('id', user.id)
    if (error) throw error
  
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${path}`
    set({ user: { ...user, avatar_url: publicUrl } })
    await supabaseBrowser.from('profile').update({ avatar_path: path }).eq('id', user.id)
    // 선택: auth 메타데이터에도 경로 저장 시
    await supabaseBrowser.auth.updateUser({ data: { avatar_path: path } })
  },

  removeAvatar: async () => {
    const { user } = get()
    if (!user) return

    const { error } = await supabaseBrowser
      .from('profile')
      .update({ avatar_path: null })
      .eq('id', user.id)
    if (error) throw error

    await supabaseBrowser.auth.updateUser({ data: { avatar_path: null as unknown as undefined } })

    set({ user: { id: user.id, name: user.name, email: user.email } })
  },

  updateProfile: async (fields: { name?: string; role?: 'OWNER' | 'MANAGER' }) => {
    const current = get().user
    if (!current) return

    const updates: Record<string, unknown> = {}
    if (typeof fields.name === 'string') updates.name = fields.name
    if (typeof fields.role === 'string') updates.role = fields.role

    if (Object.keys(updates).length === 0) return

    const { error } = await supabaseBrowser
      .from('profile')
      .update(updates)
      .eq('id', current.id)
    if (error) throw error

    set({ user: { ...current, ...(fields.name ? { name: fields.name } : {}) } })
  },

  changePassword: async (newPassword: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabaseBrowser.auth.updateUser({ password: newPassword })
      if (error) throw error
      set({ loading: false })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Password change failed', loading: false })
      throw e
    }
  },

  deleteAccount: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to delete account')
      }
      await supabaseBrowser.auth.signOut()
      if (typeof document !== 'undefined') {
        document.cookie = 'sb-access-token=; Path=/; Max-Age=0; SameSite=Lax'
      }
      set({ user: null, loading: false })
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Delete account failed', loading: false })
      throw e
    }
  },

  clearError: () => set({ error: null }),
}))