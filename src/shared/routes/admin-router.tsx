import Role from '@constants/role';
import useAuthStore from '@store/auth-store';
import useUserStore from '@store/user-store';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRouter = () => {
  const { authData } = useAuthStore();
  const { user } = useUserStore();

  const isAuthenticated = !!authData?.accessToken;
  const isAdmin = user?.role === Role.ADMIN;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    alert('관리자만 접근할 수 있는 페이지입니다.');
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRouter;
