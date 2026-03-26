import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from 'src/shared/store/auth-store';
const PublicRouter = () => {
    const { authData } = useAuthStore();
    const isAuthenticated = !!(authData === null || authData === void 0 ? void 0 : authData.accessToken);
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(Outlet, {});
};
export default PublicRouter;
