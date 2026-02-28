import {createBrowserRouter} from 'react-router-dom';

import ProtectedRouter from '@routes/protected-router';
import RootLayout from '@layouts/root-layout';
import NotLogin from '@pages/common/not-login';
import Login from '@pages/auth/login';
import Register from '@pages/auth/register';
import ReceiptView from '@pages/view/receipt-view';
import ReceiptCreate from '@pages/create/receipt-create';
import Mypage from '@pages/mypage/mypage';
import MainPage from '@pages/main/main-page';

export const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {index: true, element: <MainPage/>},
      {path: 'login', element: <Login/>},
      {path: 'register', element: <Register/>},
      {path: 'not-login', element: <NotLogin/>},
      {path: 'receipt-view/:clubid', element: <ReceiptView/>},
      {
        element: <ProtectedRouter/>,
        children: [
          {path: 'receipt-create', element: <ReceiptCreate/>},
          {path: 'mypage', element: <Mypage/>}
        ],
      },
    ]
  }
])