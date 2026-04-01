import { isMaintenanceMode, maintenanceCopy } from '@constants/maintenance';
import Footer from '@layouts/footer';
import HeaderGnb from '@layouts/header-gnb';
import Sidebar from '@layouts/sidebar';
import Maintenance from '@pages/common/maintenance';
import { AuthTokenWatcher } from '@routes/auth-token-watcher';
import { useLayoutStore } from '@store/layout-store';
import { Outlet } from 'react-router-dom';
import HeaderLnb from './header-lnb';

const RootLayout = () => {
  const { isSidebarOpen, closeSidebar, openSidebar } = useLayoutStore();
  const navigationDisabled = isMaintenanceMode;

  return (
    <div className="flex h-full min-h-screen flex-col">
      {!isMaintenanceMode && <AuthTokenWatcher />}
      <HeaderGnb navigationDisabled={navigationDisabled} />
      <HeaderLnb
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
        navigationDisabled={navigationDisabled}
      />
      <div className="relative flex flex-1">
        {isSidebarOpen && (
          <div className="absolute z-50 h-full md:static">
            <Sidebar navigationDisabled={navigationDisabled} />
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
          {isMaintenanceMode ? <Maintenance maintenance={maintenanceCopy} /> : <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
