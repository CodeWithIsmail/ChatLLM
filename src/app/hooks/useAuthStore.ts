import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  username: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  login: (token: string, user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: User) => void
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token: string, user: User) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      updateUser: (user: User) =>
        set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
