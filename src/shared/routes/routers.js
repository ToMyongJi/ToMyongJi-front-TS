import { jsx as _jsx } from "react/jsx-runtime";
import RootLayout from '@layouts/root-layout';
import FindAccount from '@pages/auth/find-account';
import Login from '@pages/auth/login';
import Register from '@pages/auth/register';
import NotLogin from '@pages/common/not-login';
import ReceiptCreate from '@pages/create/receipt-create';
import AdminPage from '@pages/main/admin-page';
import MainPage from '@pages/main/main-page';
import Mypage from '@pages/mypage/mypage';
import TossbankCreate from '@pages/create/tossbank-create';
import ButtonTestPage from '@pages/test/button-test';
import ReceiptView from '@pages/view/receipt-view';
import ProtectedRouter from '@routes/protected-router';
import { createBrowserRouter } from 'react-router-dom';
import PublicRouter from './public-router';
export const router = createBrowserRouter([
    {
        element: _jsx(RootLayout, {}),
        children: [
            { index: true, element: _jsx(MainPage, {}) },
            { path: 'home-admin', element: _jsx(AdminPage, {}) },
            { path: 'not-login', element: _jsx(NotLogin, {}) },
            { path: 'receipt-view/:clubid', element: _jsx(ReceiptView, {}) },
            { path: 'test/buttons', element: _jsx(ButtonTestPage, {}) },
            // 이미 로그인된 사용자의 접근을 막는 라우터 (로그인, 회원가입)
            {
                element: _jsx(PublicRouter, {}),
                children: [
                    { path: 'login', element: _jsx(Login, {}) },
                    { path: 'register', element: _jsx(Register, {}) },
                    { path: 'find-account', element: _jsx(FindAccount, {}) },
                ],
            },
            // 로그인된 사용자만 접근할 수 있는 라우터 (영수증 생성, 마이페이지)
            {
                element: _jsx(ProtectedRouter, {}),
                children: [
                    { path: 'receipt-create', element: _jsx(ReceiptCreate, {}) },
                    { path: 'tossbank-create', element: _jsx(TossbankCreate, {}) },
                    { path: 'mypage', element: _jsx(Mypage, {}) },
                ],
            },
        ],
    },
]);
