import bang from '@assets/icons/bang.svg';
import Button from '@components/common/button';
import { useNavigate } from 'react-router-dom';

const NotLogin = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-[30rem] flex-col items-center justify-center gap-[3rem]">
        <img src={bang} alt="bang" className="h-[6.6rem] w-[6.6rem]" />
        <p className="W_Title text-black">로그인 후 이용할 수 있어요</p>
        <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
          로그인하러 가기
        </Button>
      </div>
    </div>
  );
};

export default NotLogin;
