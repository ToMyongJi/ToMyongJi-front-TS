import Role from '@constants/role';
import { cn } from '@libs/cn';
import { useLayoutStore } from '@store/layoutStore';
import { useStudentClubStore } from '@store/studentClubStore';
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
};

const HeaderLnb = ({ openSidebar, closeSidebar }: HeaderLnbProps) => {
  const isSidebarOpen = useLayoutStore((s) => s.isSidebarOpen);
  const { user } = useUserStore();
  const isAdmin = user?.role === Role.ADMIN;
  const selectedClub = useStudentClubStore((s) => s.selectedClub);
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

    if (path === '/receipt-view') {
      if (isSidebarOpen && (!isAdmin || viewTabActive)) {
        closeSidebar?.();

        return;
      }
      if (isAdmin && selectedClub?.studentClubId != null) {
        navigate(`/receipt-view/${selectedClub.studentClubId}`);
      }
      openSidebar?.();
      return;
    }

    if (path === '/management' && isAdmin) {
      if (isSidebarOpen && mgmtTabActive) {
        closeSidebar?.();

        return;
      }
      navigate(`/management/${selectedClub?.studentClubId}`);
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
