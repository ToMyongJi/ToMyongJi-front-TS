import type { college } from '@apis/college/college';
import { collegeQuery } from '@apis/college/college-queries';
import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';
import ArrowUpIcon from '@assets/icons/arrow-up.svg?react';
import { cn } from '@libs/cn';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const [isActiveCollege, setIsActiveCollege] = useState<string>('');
  const [isActiveClubs, setIsActiveClubs] = useState<string>('');

  const { data: collegeAndClubs } = useQuery(collegeQuery.collegeAndClubs());

  const setActiveSideBar = (current: string, target: string) => {
    return current !== target;
  };

  const handleMenuClick = (club: college) => {
    setIsActiveClubs(club?.studentClubName);
    navigate(`/receipt-view/${club.studentClubId}`);
  };

  return (
    <div className="h-full w-[25.2rem] flex-shrink-0 overflow-hidden overflow-y-auto border-gray-20 border-r">
      <div className="h-full">
        {collegeAndClubs?.data?.map((item, idx) => (
          <div key={idx}>
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
                {item?.clubs?.map((club: college, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleMenuClick(club)}
                    className={cn(
                      'W_SB13 w-full cursor-pointer py-[1.4rem] pl-[4rem] text-start text-gray-90',
                      !setActiveSideBar(isActiveClubs, club.studentClubName) && 'bg-background',
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
