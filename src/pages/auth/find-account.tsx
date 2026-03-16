import { authApi } from '@apis/auth/auth';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FindAccount = () => {
  const [email, setEmail] = useState('');
  const isValidEmail = emailRegex.test(email);
  const [foundId, setFoundId] = useState<string | null>();
  const navigate = useNavigate();

  const { mutate: findId } = useMutation({
    mutationFn: (email: string) => authApi.findId({ email }),
    onSuccess: (data) => {
      setFoundId(data.data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleFindAccount = () => {
    findId(email);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="my-[6rem] flex w-full max-w-[35.2rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-left text-black">아이디 찾기</p>
        {/* 이메일 입력 창 */}
        <div className="flex flex-col items-center gap-[1.6rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
          <div className="flex w-full items-center gap-[1rem]">
            <p className="W_B15 w-[5.6rem] text-left text-gray-90">이메일</p>
            <TextField
              type="default"
              placeholder="이메일"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {foundId && (
            <p className="W_SB12 w-full text-left text-black">
              해당 이메일로 등록된 아이디는 <span className="W_SB12 text-black">{foundId}</span>
              입니다.
            </p>
          )}
        </div>
        {/* 아이디 찾기 버튼 */}
        <Button
          variant="primary"
          size="md"
          className="w-full"
          disabled={!isValidEmail && !foundId}
          onClick={foundId ? () => navigate('/login') : handleFindAccount}
        >
          {foundId ? '확인' : '아이디 찾기'}
        </Button>
      </div>
    </div>
  );
};

export default FindAccount;
