import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MainLogo from '@assets/icons/logo.svg?react';
import { Button } from '@components/common/button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
import useStudentClubStore from '../store/student-club-store';
import useUserStore from '../store/user-store';
const HeaderGnb = () => {
    const navigate = useNavigate();
    const { authData, clearAuthData } = useAuthStore();
    const { user, clearUser } = useUserStore();
    const { allClubsFlat, getClubNameById, fetchClubs } = useStudentClubStore();
    useEffect(() => {
        if (authData && allClubsFlat.length === 0) {
            fetchClubs();
        }
    }, [authData, allClubsFlat.length, fetchClubs]);
    const studentClubName = (user === null || user === void 0 ? void 0 : user.studentClubId) != null ? getClubNameById(user.studentClubId) : '';
    const handleLogout = () => {
        clearAuthData();
        clearUser();
        navigate('/');
    };
    return (_jsxs("div", { className: "flex-row-between border-gray-10 border-b px-[4rem] py-[1.3rem]", children: [_jsx("button", { type: "button", className: "cursor-pointer", onClick: () => navigate('/'), children: _jsx(MainLogo, { className: "h-[3.8rem] w-[4.3rem]" }) }), authData ? (_jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx("span", { className: "W_B14 text-black", children: studentClubName || '학생회' }), _jsx(Button, { variant: "gray", size: "sm", onClick: handleLogout, children: "\uB85C\uADF8\uC544\uC6C3" })] })) : (_jsx(Button, { variant: "primary_outline", size: "sm", className: "h-[3.2rem] w-[8rem]", onClick: () => navigate('/login'), children: "\uB85C\uADF8\uC778" }))] }));
};
export default HeaderGnb;
