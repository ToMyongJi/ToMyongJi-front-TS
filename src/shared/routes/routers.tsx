import RootLayout from '@layouts/root-layout';
import Login from '@pages/auth/login';
import Register from '@pages/auth/register';
import NotLogin from '@pages/common/not-login';
import ReceiptCreate from '@pages/create/receipt-create';
import AdminPage from '@pages/main/admin-page';
import MainPage from '@pages/main/main-page';
import Mypage from '@pages/mypage/mypage';
import ButtonTestPage from '@pages/test/button-test';
import ReceiptView from '@pages/view/receipt-view';
import ProtectedRouter from '@routes/protected-router';
import { createBrowserRouter } from 'react-router-dom';
import PublicRouter from './public-router';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'home-admin', element: <AdminPage /> },
      { path: 'not-login', element: <NotLogin /> },
      { path: 'receipt-view/:clubid', element: <ReceiptView /> },
      { path: 'test/buttons', element: <ButtonTestPage /> },
      // 이미 로그인된 사용자의 접근을 막는 라우터 (로그인, 회원가입)
      {
        element: <PublicRouter />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },
      // 로그인된 사용자만 접근할 수 있는 라우터 (영수증 생성, 마이페이지)
      {
        element: <ProtectedRouter />,
        children: [
          { path: 'receipt-create', element: <ReceiptCreate /> },
          { path: 'mypage', element: <Mypage /> },
        ],
      },
    ],
  },
]);
