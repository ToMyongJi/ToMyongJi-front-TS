import { useNavigate } from 'react-router-dom';
import MainLogo from "@assets/icons/logo.svg?react";

const HeaderGnb = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-row-between px-[4rem] py-[1.3rem] border-b border-gray-10">
      <button type='button' className="cursor-pointer" onClick={() => navigate('/')}>
        <MainLogo className="w-[4.3rem] h-[3.8rem]"/>
      </button>

      <button>로그인</button>
    </div>
  );
};

export default HeaderGnb;