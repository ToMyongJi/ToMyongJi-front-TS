import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/auth-store';

const ProtectedRouter = () => {
  const { authData } = useAuthStore();
  const isAuthenticated = !!authData?.accessToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouter;
