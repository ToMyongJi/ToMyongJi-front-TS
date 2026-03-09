import MainLogo from '@assets/icons/logo.svg?react';
import Button from '@components/button';
import { useNavigate } from 'react-router-dom';

const HeaderGnb = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-row-between border-gray-10 border-b px-[4rem] py-[1.3rem]">
      <button type="button" className="cursor-pointer" onClick={() => navigate('/')}>
        <MainLogo className="h-[3.8rem] w-[4.3rem]" />
      </button>

      <Button
        variant="primary_outline"
        size="sm"
        className="h-[3.2rem] w-[8rem]"
        onClick={() => navigate('/login')}
      >
        로그인
      </Button>
    </div>
  );
};

export default HeaderGnb;
