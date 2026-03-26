import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@libs/cn';
import { useLocation, useNavigate } from 'react-router-dom';
const LNB_MENULIST = [
    { label: '조회', to: '/receipt-view' },
    { label: '작성', to: '/receipt-create' },
    { label: '마이페이지', to: '/mypage' },
];
const HeaderLnb = ({ onClickSearch, setSidebarOpen }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const normalize = (p) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);
    const setPathActive = (current, target) => {
        const cur = normalize(current);
        const tgt = normalize(target);
        if (tgt === '/')
            return cur === '/';
        return cur === tgt || cur.startsWith(`${tgt}/`);
    };
    const handleClick = (path) => {
        if (path === '/receipt-view') {
            onClickSearch === null || onClickSearch === void 0 ? void 0 : onClickSearch();
            return;
        }
        if (setSidebarOpen) {
            setSidebarOpen(false);
        }
        navigate(path);
    };
    return (_jsx("div", { className: "flex gap-[3rem] border-gray-20 border-b px-[4rem]", children: LNB_MENULIST.map((item, index) => {
            const isActive = setPathActive(pathname, item.to);
            return (_jsx("button", { type: "button", onClick: () => handleClick(item.to), className: cn('w-fit cursor-pointer py-[1.6rem]', isActive && 'border-primary border-b-2'), children: _jsx("p", { className: cn('W_B17 text-gray-90', isActive && 'text-primary'), children: item.label }) }, index));
        }) }));
};
export default HeaderLnb;
