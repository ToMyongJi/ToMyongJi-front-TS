import MainLogo from '@assets/icons/logo.svg?react';
import { Button } from '@components/common/button';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';

const HeaderGnb = () => {
  const navigate = useNavigate();
  // authData와 clearAuthData(로그아웃용 함수)를 가져옵니다.
  const { authData, clearAuthData } = useAuthStore();

  // 임시로 학생회 이름을 설정 (실제로는 API 응답이나 스토어에서 가져와야 함)
  const studentClubName = '멋쟁이사자처럼 학생회';

  const handleLogout = () => {
    clearAuthData(); // 스토어에서 토큰 삭제
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className="flex-row-between border-gray-10 border-b px-[4rem] py-[1.3rem]">
      <button type="button" className="cursor-pointer" onClick={() => navigate('/')}>
        <MainLogo className="h-[3.8rem] w-[4.3rem]" />
      </button>

      {/* authData가 있으면(로그인 상태) 학생회 이름과 로그아웃 버튼 표시 */}
      {authData ? (
        <div className="flex items-center gap-[1.6rem]">
          <span className="W_B14 text-black">{studentClubName}</span>
          <Button variant="gray" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      ) : (
        /* authData가 없으면(비로그인 상태) 로그인 버튼 표시 */
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
