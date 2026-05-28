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
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MaintenanceCountdownToast from '@components/common/maintenance-countdown-toast';
import useMaintenanceAutoReset from '@hooks/use-maintenance-auto-reset';
import HeaderLnb from './header-lnb';

const COUNTDOWN_SECONDS = 10;

const RootLayout = () => {
  const { isMaintenance, isNetworkError, info, setNetworkError, setMaintenance } = useMaintenanceStore();
  const { isSidebarOpen, closeSidebar, openSidebar } = useLayoutStore();
  const { user } = useUserStore();
  const { pathname } = useLocation();
  const { data, isError } = useQuery({
    ...adminQueries.checkStatus(),
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    retry: false,
  });

  const [countdown, setCountdown] = useState<number | null>(null);
  const prevIsMaintenanceRef = useRef(isMaintenance);
  const hasInitializedRef = useRef(false);
  const skipNextCountdownRef = useRef(false);

  const isLoginPage = pathname === '/login';
  const isAdmin = user?.role === 'ADMIN';
  const isCountingDown = countdown !== null && countdown > 0;

  useMaintenanceAutoReset(isAdmin);

  useEffect(() => {
    const wasInMaintenance = prevIsMaintenanceRef.current;
    prevIsMaintenanceRef.current = isMaintenance;

    if (isMaintenance && !wasInMaintenance && !isLoginPage && !isAdmin) {
      if (skipNextCountdownRef.current) {
        skipNextCountdownRef.current = false;
      } else {
        setCountdown(COUNTDOWN_SECONDS);
      }
    }

    if (!isMaintenance) {
      setCountdown(null);
    }
  }, [isMaintenance, isLoginPage, isAdmin]);

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // 네트워크 에러는 즉시 전환, 스케줄 점검은 카운트다운 후 전환
  const isMaintenanceActive = isNetworkError || (isMaintenance && !isCountingDown);
  const navigationDisabled = isMaintenanceActive && !isAdmin;

  const maintenanceProps = info
    ? { date: `${info.startTime} ~ ${info.expectedEndTime}`, description: info.message }
    : { date: '', description: '' };

  useEffect(() => {
    if (isError) {
      setNetworkError(true);
    } else if (data) {
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true;
        const now = new Date();
        const start = new Date(data.data.startTime);
        const end = new Date(data.data.expectedEndTime);
        if (now >= start && now <= end) {
          skipNextCountdownRef.current = true;
        }
      }
      setMaintenance(data.data);
    }
  }, [data, isError, setMaintenance, setNetworkError]);

  // 점검 중이고, 로그인 페이지도 아니고, 관리자도 아닌 경우 → 풀스크린 점검 화면
  if (isMaintenanceActive && !isLoginPage && !isAdmin) {
    return (
      <>
        <div className="flex h-full min-h-screen flex-col items-center justify-center">
          <Maintenance maintenance={maintenanceProps} />
        </div>
        <AnimatePresence>
          {isCountingDown && (
            <MaintenanceCountdownToast key="maintenance-toast" seconds={countdown ?? COUNTDOWN_SECONDS} total={COUNTDOWN_SECONDS} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      {(!isMaintenanceActive || isAdmin) && <AuthTokenWatcher />}
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
          <Outlet />
        </main>
      </div>
      <Footer />
      <AnimatePresence>
        {isCountingDown && !isAdmin && !isLoginPage && (
          <MaintenanceCountdownToast key="maintenance-toast" seconds={countdown ?? COUNTDOWN_SECONDS} total={COUNTDOWN_SECONDS} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RootLayout;
