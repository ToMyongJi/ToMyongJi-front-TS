import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HeaderGnb from '@layouts/header-gnb';
import Sidebar from '@layouts/sidebar';
import Footer from '@layouts/footer';
import HeaderLnb from './header-lnb';
import { Outlet } from 'react-router-dom';
import { useLayoutStore } from '@store/layout-store';
const RootLayout = () => {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayoutStore();
    return (_jsxs("div", { className: "flex h-full min-h-screen flex-col", children: [_jsx(HeaderGnb, {}), _jsx(HeaderLnb, { onClickSearch: toggleSidebar }), _jsxs("div", { className: "relative flex flex-1", children: [isSidebarOpen && (_jsx("div", { className: "absolute z-50 h-full md:static", children: _jsx(Sidebar, {}) })), _jsxs("main", { className: "relative min-h-0 flex-1 overflow-auto", children: [isSidebarOpen && (_jsx("button", { type: "button", className: "absolute inset-0 z-40 bg-black/20 max-md:block md:hidden", onClick: closeSidebar, "aria-label": "\uC0AC\uC774\uB4DC\uBC14 \uB2EB\uAE30" })), _jsx(Outlet, {})] })] }), _jsx(Footer, {})] }));
};
export default RootLayout;
