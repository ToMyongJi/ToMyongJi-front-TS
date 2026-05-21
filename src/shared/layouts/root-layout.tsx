import Footer from '@layouts/footer';
import HeaderGnb from '@layouts/header-gnb';
import Sidebar from '@layouts/sidebar';
import { cn } from '@libs/cn';
import Maintenance from '@pages/common/maintenance';
import { AuthTokenWatcher } from '@routes/auth-token-watcher';
import { useLayoutStore } from '@store/layout-store';
import useMaintenanceStore from '@store/maintenance-store';
import useUserStore from '@store/user-store';
import { adminQueries } from '@apis/admin/admin-queries';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderLnb from './header-lnb';

const RootLayout = () => {
  const { isMaintenance, isNetworkError, info, setNetworkError, setMaintenance } = useMaintenanceStore();
  const { isSidebarOpen, closeSidebar, openSidebar } = useLayoutStore();
  const { user } = useUserStore();
  const { pathname } = useLocation();
  const { data, isError } = useQuery({ ...adminQueries.checkStatus(), refetchInterval: 10_000, retry: false });

  const isMaintenanceActive = isMaintenance || isNetworkError;
  const isLoginPage = pathname === '/login';
  const isAdmin = user?.role === 'ADMIN';
  const navigationDisabled = isMaintenanceActive && !isAdmin;

  const maintenanceProps = info
    ? { date: `${info.startTime} ~ ${info.expectedEndTime}`, description: info.message }
    : { date: '', description: '' };

  useEffect(() => {
    if (isError) {
      setNetworkError(true);
    } else if (data) {
      setMaintenance(data.data);
    }
  }, [data, isError, setMaintenance, setNetworkError]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      {!isMaintenanceActive && <AuthTokenWatcher />}
      <HeaderGnb />
      <HeaderLnb
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
        navigationDisabled={navigationDisabled}
      />
      <div className="relative flex flex-1">
        <div
          className={cn(
            'absolute z-50 h-full overflow-hidden transition-[width] duration-300 ease-in-out md:static',
            isSidebarOpen ? 'w-[25.2rem]' : 'w-0',
          )}
          aria-hidden={!isSidebarOpen}
        >
          <Sidebar navigationDisabled={navigationDisabled} />
        </div>
        <main className="relative min-h-0 flex-1 overflow-auto">
          <button
            type="button"
            className={cn(
              'absolute inset-0 z-40 bg-black/20 transition-opacity duration-300 max-md:block md:hidden',
              isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={closeSidebar}
            aria-label="사이드바 닫기"
            aria-hidden={!isSidebarOpen}
          />
          {isMaintenanceActive && !isLoginPage && !isAdmin ? <Maintenance maintenance={maintenanceProps} /> : <Outlet />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
