import HeaderGnb from '@layouts/header-gnb';
import Sidebar from '@layouts/sidebar';
import Footer from '@layouts/footer';

import HeaderLnb from './header-lnb';
import { Outlet } from 'react-router-dom';
import { useLayoutStore } from '@store/layout-store';

const RootLayout = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayoutStore();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <HeaderGnb />
      <HeaderLnb onClickSearch={toggleSidebar}/>
      <div className="relative flex flex-1">
        {isSidebarOpen && (
          <div className="absolute z-50 h-full md:static">
            <Sidebar />
          </div>
        )}
        <main className="relative min-h-0 flex-1 overflow-auto">
          {isSidebarOpen && (
            <button
              type="button"
              className="absolute inset-0 z-40 bg-black/20 max-md:block md:hidden"
              onClick={closeSidebar}
              aria-label="사이드바 닫기"
            />
          )}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;