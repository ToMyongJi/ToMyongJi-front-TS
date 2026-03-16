import MainLogo from '@assets/icons/logo.svg?react';
import { Button } from '@components/common/button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
import useStudentClubStore from '../store/student-club-store';
import useUserStore from '../store/user-store';

const HeaderGnb = () => {
  const navigate = useNavigate();
  const { authData, clearAuthData } = useAuthStore();
  const { user, clearUser } = useUserStore();

  const { allClubsFlat, getClubNameById, fetchClubs } = useStudentClubStore();

  useEffect(() => {
    if (authData && allClubsFlat.length === 0) {
      fetchClubs();
    }
  }, [authData, allClubsFlat.length, fetchClubs]);

  const studentClubName = user?.studentClubId != null ? getClubNameById(user.studentClubId) : '';

  const handleLogout = () => {
    clearAuthData();
    clearUser();
    navigate('/');
  };

  return (
    <div className="flex-row-between border-gray-10 border-b px-[4rem] py-[1.3rem]">
      <button type="button" className="cursor-pointer" onClick={() => navigate('/')}>
        <MainLogo className="h-[3.8rem] w-[4.3rem]" />
      </button>

      {authData ? (
        <div className="flex items-center gap-[1.6rem]">
          <span className="W_B14 text-black">{studentClubName || '학생회'}</span>
          <Button variant="gray" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      ) : (
        <Button
          variant="primary_outline"
          size="sm"
          className="h-[3.2rem] w-[8rem]"
          onClick={() => navigate('/login')}
        >
          로그인
        </Button>
      )}
    </div>
  );
};

export default HeaderGnb;
