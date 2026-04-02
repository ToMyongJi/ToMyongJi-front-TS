import { authMutations } from '@apis/auth/auth-mutations';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useModal } from '@hooks/use-modal';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FindPasswordForm = () => {
  const [email, setEmail] = useState('');
  const isValidEmail = emailRegex.test(email);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { alert } = useModal();

  const { mutate: sendResetEmail, isPending } = useMutation({
    ...authMutations.resetPasswordSendEmail(),
    onSuccess: () => {
      setSent(true);
      setError(null);
      alert({
        title: '이메일 발송 성공',
        description: '해당 이메일의 메일함을 확인해 주세요.',
        confirmText: '확인',
      });
    },
    onError: () => {
      setError('메일 발송에 실패했습니다. 이메일을 확인해 주세요.');
      alert({
        title: '이메일 발송 실패',
        description: '이메일이 정확한지 다시 확인해 주세요.',
        confirmText: '확인',
      });
    },
  });

  const handleSubmit = () => {
    sendResetEmail({ email });
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
            disabled={sent}
            isError={!!error}
          />
        </div>
        {sent ? (
          <p className="W_SB12 w-full text-left text-gray-80">메일함을 확인해 주세요.</p>
        ) : (
          <p className="W_SB12 w-full text-left text-error">{error}</p>
        )}
      </div>
      <Button
        variant="primary"
        size="md"
        className="w-full"
        disabled={(!isValidEmail && !sent) || isPending}
        onClick={sent ? () => navigate('/login') : handleSubmit}
      >
        {isPending ? '발송 중...' : sent ? '확인' : '재설정 이메일 발송'}
      </Button>
    </>
  );
};

export default FindPasswordForm;
