import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from 'src/shared/store/auth-store';

const PublicRouter = () => {
  const { authData } = useAuthStore();
  const isAuthenticated = !!authData?.accessToken;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRouter;
