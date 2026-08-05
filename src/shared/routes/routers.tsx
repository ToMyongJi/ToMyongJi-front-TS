import { maintenanceCopy } from '@constants/maintenance';
import RootLayout from '@layouts/root-layout';
import Maintenance from '@pages/common/maintenance';
import MainPage from '@pages/main/main-page';
import ProtectedRouter from '@routes/protected-router';
// import ButtonTestPage from '@pages/test/button-test';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AdminRouter from './admin-router';
import PresidentRouter from './president-router';
import PublicRouter from './public-router';

// 라우트 기반 코드 스플리팅
// MainPage는 첫 진입 페이지라 정적 유지(청크 워터폴로 LCP 악화 방지),
// Maintenance는 root-layout이 이미 정적으로 물고 있어 lazy로 바꿔도 번들에서 빠지지 않는다.
const ReceiptsList = lazy(() => import('@pages/view/receipts-list'));
const Login = lazy(() => import('@pages/auth/login'));
const Register = lazy(() => import('@pages/auth/register'));
const FindAccount = lazy(() => import('@pages/auth/find-account'));
const ResetPassword = lazy(() => import('@pages/auth/reset-password'));
const CsvCreate = lazy(() => import('@pages/create/csv-create'));
const AiCsvCreate = lazy(() => import('@pages/create/ai-csv-create'));
const ReceiptCreate = lazy(() => import('@pages/create/receipt-create'));
const TossbankCreate = lazy(() => import('@pages/create/tossbank-create'));
const Mypage = lazy(() => import('@pages/mypage/mypage'));
const AdminPage = lazy(() => import('@pages/admin/admin-page'));
const SystemCheck = lazy(() => import('@pages/admin/system-check'));
const Management = lazy(() =>
  import('@pages/admin/management').then((m) => ({ default: m.Management })),
);
const ClubTransfer = lazy(() =>
  import('@pages/mypage/club-transfer').then((m) => ({ default: m.ClubTransfer })),
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'receipts-list/:clubid', element: <ReceiptsList /> },
      // { path: 'test/buttons', element: <ButtonTestPage /> },
      {
        path: 'maintenance',
        element: <Maintenance maintenance={maintenanceCopy} />,
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
          { path: 'ai-csv-create', element: <AiCsvCreate /> },
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
          { path: 'system-check', element: <SystemCheck /> },
        ],
      },
    ],
  },
]);
