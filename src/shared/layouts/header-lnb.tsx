import { cn } from '@libs/cn';
import type { Dispatch, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LNB_MENULIST = [
  { label: '조회', to: '/receipt-view' },
  { label: '작성', to: '/receipt-create' },
  { label: '마이페이지', to: '/mypage' },
];
const LNM_ADMIN_MENULIST = [
  { label: '조회', to: '/receipt-view' },
  { label: '학생회 관리', to: '/student-club-management' },
];

type HeaderLnbProps = {
  onClickSearch?: () => void;
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
};

const HeaderLnb = ({ onClickSearch, setSidebarOpen }: HeaderLnbProps) => {
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
    if (path === '/receipt-view') {
      onClickSearch?.();
      return;
    }
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
    navigate(path);
  };

  return (
    <div className="flex gap-[3rem] border-gray-20 border-b px-[4rem]">
      {LNB_MENULIST.map((item, index) => {
        const isActive = setPathActive(pathname, item.to);
        return (
          <button
            key={index}
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
