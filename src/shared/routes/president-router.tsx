// src/shared/routes/president-router.tsx
import Role from '@constants/role';
import NotLogin from '@pages/common/not-login';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
import useUserStore from '../store/user-store';

const PresidentRouter = () => {
  const { authData } = useAuthStore();
  const { user } = useUserStore();

  const isAuthenticated = !!authData?.accessToken;
  const isPresident = user?.role === Role.PRESIDENT;

  // 1. 로그인이 안 되어 있다면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <NotLogin />;
  }

  // 2. 로그인은 되어있지만 학생회장이 아니라면 마이페이지로 리다이렉트
  if (!isPresident) {
    alert('학생회장만 접근할 수 있는 페이지입니다.'); // 필요에 따라 생략 가능
    return <Navigate to="/mypage" replace />;
  }

  // 3. 학생회장인 경우에만 하위 라우트(페이지)를 렌더링
  return <Outlet />;
};

export default PresidentRouter;
