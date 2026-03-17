import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthData {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  authData: AuthData | null;
  setAuthData: (grantType: string, accessToken: string, refreshToken: string) => void;
  clearAuthData: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authData: null,
      setAuthData: (grantType, accessToken, refreshToken) =>
        set({
          authData: {
            grantType,
            accessToken,
            refreshToken,
          },
        }),
      clearAuthData: () => set({ authData: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
