import useAuthStore from '@store/auth-store';
import useUserStore from '@store/user-store';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const decodeJwtPayload = (token: string) => {
  const payload = token.split('.')[1];
  if (!payload) return null;

  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

  return JSON.parse(atob(padded)) as { exp?: number };
};

export const AuthTokenWatcher = () => {
  const navigate = useNavigate();
  const { authData, clearAuthData } = useAuthStore();
  const { clearUser } = useUserStore();

  const logoutByExpiration = useCallback(() => {
    clearUser();
    clearAuthData();
    alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
    navigate('/login', { replace: true });
  }, [clearUser, clearAuthData, navigate]);

  useEffect(() => {
    if (!authData?.accessToken) return;

    try {
      const decodedToken = decodeJwtPayload(authData.accessToken);
      const exp = decodedToken?.exp;

      if (!exp) {
        logoutByExpiration();
        return;
      }

      const expiresAt = exp * 1000;
      const delay = expiresAt - Date.now();

      if (delay <= 0) {
        logoutByExpiration();
        return;
      }

      const timeoutId = window.setTimeout(() => {
        logoutByExpiration();
      }, delay);

      return () => window.clearTimeout(timeoutId);
    } catch (error) {
      console.error('토큰 검증 실패:', error);
      logoutByExpiration();
    }
  }, [authData?.accessToken, logoutByExpiration]);

  return null;
};
