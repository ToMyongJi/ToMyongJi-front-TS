import type { college } from '@apis/college/college';
import { collegeQuery } from '@apis/college/college-queries';
import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';
import ArrowUpIcon from '@assets/icons/arrow-up.svg?react';
import { cn } from '@libs/cn';
import { useLayoutStore } from '@store/layoutStore';
import { useStudentClubStore } from '@store/studentClubStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { closeSidebar } = useLayoutStore();

  const [isActiveCollege, setIsActiveCollege] = useState<string>('');
  const [isActiveClubs, setIsActiveClubs] = useState<string>('');

  const { setSelectedClub, selectedClub } = useStudentClubStore();

  const { data: collegeAndClubs } = useQuery(collegeQuery.collegeAndClubs());

  const setActiveSideBar = (current: string, target: string) => {
    return current !== target;
  };

  const activeClubIdFromPath =
    pathname.match(/^\/receipt-view\/(\d+)/)?.[1] ??
    pathname.match(/^\/management\/(\d+)/)?.[1] ??
    (pathname.startsWith('/receipt-create') && selectedClub?.studentClubId != null
      ? String(selectedClub.studentClubId)
      : undefined);

  const handleMenuClick = (club: college) => {
    setIsActiveClubs(club?.studentClubName);

    setSelectedClub({
      studentClubId: club.studentClubId,
      studentClubName: club.studentClubName,
      verification: club.verification,
    });

    if (pathname.startsWith('/management')) {
      navigate(`/management/${club.studentClubId}`);
    } else if (!pathname.startsWith('/receipt-create')) {
      navigate(`/receipt-view/${club.studentClubId}`);
    }

    // md 이하일 때 사이드바 닫기 및 오버레이 제거
    if (window.matchMedia('(max-width: 767px)').matches) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full w-[25.2rem] flex-shrink-0 overflow-hidden overflow-y-auto border-gray-20 border-r bg-white">
      <div className="h-full">
        {collegeAndClubs?.data?.map((item) => (
          <div
            key={item.collegeId}
            className={cn(
              !setActiveSideBar(isActiveCollege, item.collegeName) &&
                'border-gray-10 border-t-1 border-b-1',
            )}
          >
            <button
              type="button"
              onClick={() => setIsActiveCollege(item.collegeName)}
              className="flex w-full cursor-pointer items-center justify-between py-[1.2rem] pr-[2.4rem] pl-[4rem]"
            >
              <p className="W_SB14 text-gray-90">{item.collegeName}</p>
              {setActiveSideBar(isActiveCollege, item.collegeName) ? (
                <ArrowDownIcon className="text-gray-20" />
              ) : (
                <ArrowUpIcon className="text-gray-20" />
              )}
            </button>
            {!setActiveSideBar(isActiveCollege, item.collegeName) && (
              <div className="w-full">
                {item?.clubs?.map((club: college) => (
                  <button
                    key={club.studentClubId}
                    type="button"
                    onClick={() => handleMenuClick(club)}
                    className={cn(
                      'W_SB13 w-full cursor-pointer py-[1.4rem] pl-[4rem] text-start text-gray-90',
                      (activeClubIdFromPath
                        ? activeClubIdFromPath === String(club.studentClubId)
                        : !setActiveSideBar(isActiveClubs, club.studentClubName)) && 'bg-background',
                    )}
                  >
                    {club?.studentClubName}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
