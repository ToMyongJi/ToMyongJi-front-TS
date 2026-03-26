import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
const ProtectedRouter = () => {
    const { authData } = useAuthStore();
    const isAuthenticated = !!(authData === null || authData === void 0 ? void 0 : authData.accessToken);
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(Outlet, {});
};
export default ProtectedRouter;
