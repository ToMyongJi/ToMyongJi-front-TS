import Role from '@constants/role';
import { cn } from '@libs/cn';
import { useLayoutStore } from '@store/layout-store';
import { useSidebarStore } from '@store/sidebar-store';
import useUserStore from '@store/user-store';
import { useLocation, useNavigate } from 'react-router-dom';

const LNB_MENULIST = [
  { label: '조회', to: '/receipt-view' },
  { label: '작성', to: '/receipt-create' },
  { label: '마이페이지', to: '/mypage' },
];
const LNM_ADMIN_MENULIST = [
  { label: '조회', to: '/receipt-view' },
  { label: '학생회 관리', to: '/management' },
];

type HeaderLnbProps = {
  openSidebar?: () => void;
  closeSidebar?: () => void;
  /** true이면 페이지 이동을 막습니다. 조회 탭은 사이드바를 열지 않고, 관리자 학생회 관리 탭만 사이드바를 토글합니다. */
  navigationDisabled?: boolean;
};

const HeaderLnb = ({ openSidebar, closeSidebar, navigationDisabled = false }: HeaderLnbProps) => {
  const isSidebarOpen = useLayoutStore((s) => s.isSidebarOpen);
  const { user } = useUserStore();
  const isAdmin = user?.role === Role.ADMIN;
  const selectedClub = useSidebarStore((s) => s.selectedClub);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const normalize = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);

  const setPathActive = (current: string, target: string) => {
    const cur = normalize(current);
    const tgt = normalize(target);
    if (tgt === '/') return cur === '/';
    return cur === tgt || cur.startsWith(`${tgt}/`);
  };

  const handleClick = (path: string) => {
    const viewTabActive = pathname.startsWith('/receipt-view');
    const mgmtTabActive = pathname.startsWith('/management');

    if (navigationDisabled) {
      if (path === '/receipt-view') {
        return;
      }
      if (path === '/management' && isAdmin) {
        if (isSidebarOpen && mgmtTabActive) {
          closeSidebar?.();
          return;
        }
        openSidebar?.();
        return;
      }
      return;
    }

    if (path === '/receipt-view') {
      if (isSidebarOpen && viewTabActive) {
        closeSidebar?.();

        return;
      }
      // 관리자는 학생회 관리 화면(/management)에 있을 때 조회만 누르면 URL이 그대로라
      // 사이드바가 계속 management 기준으로 동작하므로, 조회 전환 시 영수증 조회 경로로 이동합니다.
      if (isAdmin && pathname.startsWith('/management')) {
        const clubIdFromPath = pathname.match(/^\/management\/(\d+)/)?.[1];
        const clubId =
          clubIdFromPath ??
          (selectedClub?.studentClubId != null ? String(selectedClub.studentClubId) : undefined);
        if (clubId != null) {
          navigate(`/receipt-view/${clubId}`);
        }
        openSidebar?.();
        return;
      }
      openSidebar?.();
      return;
    }

    if (path === '/management' && isAdmin) {
      if (isSidebarOpen && mgmtTabActive) {
        closeSidebar?.();
        return;
      }
      if (selectedClub?.studentClubId != null) {
        navigate(`/management/${selectedClub.studentClubId}`);
      } else {
        navigate('/management');
      }
      openSidebar?.();
      return;
    }
    closeSidebar?.();
    navigate(path);
  };

  return (
    <div className="flex gap-[3rem] border-gray-20 border-b px-[4rem]">
      {(isAdmin ? LNM_ADMIN_MENULIST : LNB_MENULIST).map((item) => {
        const isActive = setPathActive(pathname, item.to);
        return (
          <button
            key={item.to}
            type="button"
            onClick={() => handleClick(item.to)}
            className={cn(
              'w-fit cursor-pointer py-[1.6rem]',
              isActive && 'border-primary border-b-2',
            )}
          >
            <p className={cn('W_B17 text-gray-90', isActive && 'text-primary')}>{item.label}</p>
          </button>
        );
      })}
    </div>
  );
};

export default HeaderLnb;
