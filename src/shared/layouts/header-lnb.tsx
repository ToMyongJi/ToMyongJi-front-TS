import { cn } from '@libs/cn';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LNB_MENULIST = [
  { label: '조회', to: '/receipt-view' },
  { label: '작성', to: '/receipt-create' },
  { label: '마이페이지', to: '/mypage' },
];

type HeaderLnbProps = {
  onClickSearch?: () => void;
};

const HeaderLnb = ({ onClickSearch }: HeaderLnbProps) => {
  const { pathname } = useLocation();
  const [isActiveReview, setIsActiveReview] = useState(false);
  const navigate = useNavigate();
  const normalize = (p: string) =>
    p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;

  const setPathActive = (current: string, target: string) => {
    // if (target === 'sidebar') return false;

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
    navigate(path);
  };

  return (
    <div className="px-[4rem] flex gap-[3rem] border-b border-gray-20">
      {LNB_MENULIST.map((item, index) => {
        const isActive = setPathActive(pathname, item.to);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(item.to)}
            className={cn(
              'w-fit py-[1.6rem] cursor-pointer',
              isActive && 'border-b-2 border-primary',
            )}
          >
            <p
              className={cn(
                'W_B17 text-gray-90',
                isActive && 'text-primary',
              )}
            >
              {item.label}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default HeaderLnb;

