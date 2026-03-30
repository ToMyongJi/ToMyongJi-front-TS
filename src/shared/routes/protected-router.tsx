import NotLogin from '@pages/common/not-login';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../store/auth-store';

const ProtectedRouter = () => {
  const { authData } = useAuthStore();
  const isAuthenticated = !!authData?.accessToken;

  if (!isAuthenticated) {
    return <NotLogin />;
  }

  return <Outlet />;
};

export default ProtectedRouter;
