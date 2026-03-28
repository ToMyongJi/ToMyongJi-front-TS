import { authApi } from '@apis/auth/auth';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FindIdForm = () => {
  const [email, setEmail] = useState('');
  const isValidEmail = emailRegex.test(email);
  const [foundId, setFoundId] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { mutate: findId } = useMutation({
    mutationFn: (emailValue: string) => authApi.findId({ email: emailValue }),
    onSuccess: (data) => {
      setFoundId(data.data);
      setError(null);
    },
    onError: () => {
      setError('등록되지 않은 이메일입니다.');
    },
  });

  const handleFindAccount = () => {
    findId(email);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[1.6rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
        <div className="flex w-full items-center gap-[1rem]">
          <p className="W_B15 w-[5.6rem] text-left text-gray-90">이메일</p>
          <TextField
            type="default"
            placeholder="이메일"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!foundId}
          />
        </div>
        {foundId ? (
          <p className="W_SB12 w-full text-left text-black">
            해당 이메일로 등록된 아이디는 <span className="W_SB12 text-black">{foundId}</span>
            입니다.
          </p>
        ) : (
          <p className="W_SB12 w-full text-left text-error">{error}</p>
        )}
      </div>
      <Button
        variant="primary"
        size="md"
        className="w-full"
        disabled={!isValidEmail && !foundId}
        onClick={foundId ? () => navigate('/login') : handleFindAccount}
      >
        {foundId ? '확인' : '아이디 찾기'}
      </Button>
    </>
  );
};

export default FindIdForm;
