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

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'home-admin', element: <AdminPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'not-login', element: <NotLogin /> },
      { path: 'receipt-view/:clubid', element: <ReceiptView /> },
      { path: 'test/buttons', element: <ButtonTestPage /> },
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
