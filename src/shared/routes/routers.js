import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@layouts/root-layout';
import MainPage from '@pages/main/main-page';
export const router = createBrowserRouter([
    {
        element: _jsx(RootLayout, {}),
        children: [
            { index: true, element: _jsx(MainPage, {}) }
        ]
    }
]);
