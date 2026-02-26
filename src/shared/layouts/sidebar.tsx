import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import { cn } from '@libs/cn';

import { collegeQuery } from '@apis/college/college-queries';
import { college } from '@apis/college/college';
import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';
import ArrowUpIcon from '@assets/icons/arrow-up.svg?react';


const Sidebar = () => {
  const navigate = useNavigate();

  const [isActiveCollege, setIsActiveCollege] = useState<string>('');
  const [isActiveClubs, setIsActiveClubs] = useState<string>('');

  const { data: collegeAndClubs } = useQuery(collegeQuery.collegeAndClubs());


  const setActiveSideBar = (current: string, target: string) => {
    return current === target ? false : true;
  };

  const handleMenuClick = (club: college) => {
    setIsActiveClubs(club?.studentClubName);
    navigate(`/receipt-view/${club.studentClubId}`);
  }

  return (
    <div className="border-r border-gray-20 w-[25.2rem] h-full flex-shrink-0 overflow-hidden overflow-y-auto">
      <div className="h-full">
        {collegeAndClubs?.data?.map((item, idx) => (
          <div
          key={idx}
          >
            <button
              type="button"
              onClick={() => setIsActiveCollege(item.collegeName)}
              className="flex items-center justify-between py-[1.2rem] pl-[4rem] pr-[2.4rem] cursor-pointer w-full">
              <p className="W_SB14 text-gray-90">{item.collegeName}</p>
              {setActiveSideBar(isActiveCollege, item.collegeName) ?
                <ArrowDownIcon className="text-gray-20" /> : <ArrowUpIcon className="text-gray-20"/>}
            </button>
            {!setActiveSideBar(isActiveCollege, item.collegeName) && <div className="w-full">
              {item?.clubs?.map((club: college, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMenuClick(club)}
                  className={cn('W_SB13 text-gray-90 py-[1.4rem] text-start pl-[4rem] cursor-pointer w-full', !setActiveSideBar(isActiveClubs, club.studentClubName) && "bg-background")}>{club?.studentClubName}</button>
              ))}
            </div>}

          </div>

        ))}

      </div>
    </div>
  );
};

export default Sidebar;