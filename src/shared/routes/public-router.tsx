import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from 'src/shared/store/auth-store'; // 실제 auth-store 경로에 맞게 수정해주세요

const PublicRouter = () => {
  // Zustand 스토어에서 토큰(또는 로그인 상태)을 가져옵니다.
  const { authData } = useAuthStore();
  const isAuthenticated = !!authData?.accessToken; // 토큰이 있으면 true

  // 이미 로그인된 상태라면 메인 페이지('/')로 리다이렉트 시킵니다.
  // replace 속성을 주어 뒤로가기 했을 때 다시 로그인 페이지로 오지 않게 합니다.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 로그인되지 않은 상태라면 정상적으로 하위 라우트(로그인, 회원가입 등)를 보여줍니다.
  return <Outlet />;
};

export default PublicRouter;
