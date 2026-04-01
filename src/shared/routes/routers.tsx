import RootLayout from '@layouts/root-layout';
import AdminPage from '@pages/admin/admin-page';
import { Management } from '@pages/admin/management';
import FindAccount from '@pages/auth/find-account';
import Login from '@pages/auth/login';
import Register from '@pages/auth/register';
import ResetPassword from '@pages/auth/reset-password';
import Maintenance from '@pages/common/maintenance';
import CsvCreate from '@pages/create/csv-create';
import ReceiptCreate from '@pages/create/receipt-create';
import TossbankCreate from '@pages/create/tossbank-create';
import MainPage from '@pages/main/main-page';
import { ClubTransfer } from '@pages/mypage/club-transfer';
import Mypage from '@pages/mypage/mypage';
import ButtonTestPage from '@pages/test/button-test';
import ReceiptView from '@pages/view/receipt-view';
import ProtectedRouter from '@routes/protected-router';
import { createBrowserRouter } from 'react-router-dom';
import AdminRouter from './admin-router';
import PresidentRouter from './president-router';
import PublicRouter from './public-router';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'receipt-view/:clubid', element: <ReceiptView /> },
      { path: 'test/buttons', element: <ButtonTestPage /> },
      {
        path: 'maintenance',
        element: (
          <Maintenance
            maintenance={{
              date: '0월 00일 00:00 ~ 0월 00일 00:00',
              description: '서버 성능 개선 및 안정화',
            }}
          />
        ),
      },
      // 이미 로그인된 사용자의 접근을 막는 라우터 (로그인, 회원가입)
      {
        element: <PublicRouter />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'find-account', element: <FindAccount /> },
          { path: 'password/reset', element: <ResetPassword /> },
          { path: 'password/reset/:token', element: <ResetPassword /> },
        ],
      },
      // 로그인된 사용자만 접근할 수 있는 라우터 (영수증 생성, 마이페이지)
      {
        element: <ProtectedRouter />,
        children: [
          { path: 'csv-create', element: <CsvCreate /> },
          { path: 'receipt-create', element: <ReceiptCreate /> },
          { path: 'tossbank-create', element: <TossbankCreate /> },
          { path: 'mypage', element: <Mypage /> },
        ],
      },
      // 학생회장만 접근할 수 있는 라우터
      {
        element: <PresidentRouter />,
        children: [{ path: 'club-transfer', element: <ClubTransfer /> }],
      },
      // 관리자만 접근할 수 있는 라우터
      {
        element: <AdminRouter />,
        children: [
          { path: 'home-admin', element: <AdminPage /> },
          { path: 'management', element: <Management /> },
          { path: 'management/:clubId', element: <Management /> },
        ],
      },
    ],
  },
]);
