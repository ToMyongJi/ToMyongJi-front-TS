import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cn } from '@libs/cn';
import { useStudentClubStore } from '@store/sidebar-store';
import { useLayoutStore } from '@store/layout-store';
import { collegeQuery } from '@apis/college/college-queries';
import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';
import ArrowUpIcon from '@assets/icons/arrow-up.svg?react';
const Sidebar = () => {
    var _a;
    const navigate = useNavigate();
    const { closeSidebar } = useLayoutStore();
    const [isActiveCollege, setIsActiveCollege] = useState('');
    const [isActiveClubs, setIsActiveClubs] = useState('');
    const { setSelectedClub } = useStudentClubStore();
    const { data: collegeAndClubs } = useQuery(collegeQuery.collegeAndClubs());
    const setActiveSideBar = (current, target) => {
        return current !== target;
    };
    const handleMenuClick = (club) => {
        setIsActiveClubs(club === null || club === void 0 ? void 0 : club.studentClubName);
        setSelectedClub({
            studentClubId: club.studentClubId,
            studentClubName: club.studentClubName,
            verification: club.verification,
        });
        navigate(`/receipt-view/${club.studentClubId}`);
        // md 이하일 때 사이드바 닫기 및 오버레이 제거
        if (window.matchMedia('(max-width: 767px)').matches) {
            closeSidebar();
        }
    };
    return (_jsx("div", { className: "h-full w-[25.2rem] flex-shrink-0 overflow-hidden overflow-y-auto border-gray-20 border-r bg-white", children: _jsx("div", { className: "h-full", children: (_a = collegeAndClubs === null || collegeAndClubs === void 0 ? void 0 : collegeAndClubs.data) === null || _a === void 0 ? void 0 : _a.map((item) => {
                var _a;
                return (_jsxs("div", { className: cn(!setActiveSideBar(isActiveCollege, item.collegeName) && 'border-gray-10 border-t-1 border-b-1'), children: [_jsxs("button", { type: "button", onClick: () => setIsActiveCollege(item.collegeName), className: "flex w-full cursor-pointer items-center justify-between py-[1.2rem] pr-[2.4rem] pl-[4rem]", children: [_jsx("p", { className: "W_SB14 text-gray-90", children: item.collegeName }), setActiveSideBar(isActiveCollege, item.collegeName) ?
                                    _jsx(ArrowDownIcon, { className: "text-gray-20" }) : _jsx(ArrowUpIcon, { className: "text-gray-20" })] }), !setActiveSideBar(isActiveCollege, item.collegeName) && _jsx("div", { className: "w-full", children: (_a = item === null || item === void 0 ? void 0 : item.clubs) === null || _a === void 0 ? void 0 : _a.map((club) => (_jsx("button", { type: "button", onClick: () => handleMenuClick(club), className: cn('W_SB13 w-full cursor-pointer py-[1.4rem] pl-[4rem] text-start text-gray-90', !setActiveSideBar(isActiveClubs, club.studentClubName) && "bg-background"), children: club === null || club === void 0 ? void 0 : club.studentClubName }, club.studentClubId))) })] }, item.collegeId));
            }) }) }));
};
export default Sidebar;
