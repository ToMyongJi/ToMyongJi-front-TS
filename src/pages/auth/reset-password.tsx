import { authMutations } from '@apis/auth/auth-mutations';
import tomyongjiCheck from '@assets/icons/tomyongji-check.svg';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;
const SPECIAL_RE = /[!@#$%^&*(),.?":{}|<>]/;

const isPasswordPolicyOk = (password: string) =>
  password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX && SPECIAL_RE.test(password);

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token: tokenFromPath } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token');

  const token = useMemo(
    () =>
      tokenFromPath
        ? decodeURIComponent(tokenFromPath)
        : tokenFromQuery
          ? decodeURIComponent(tokenFromQuery)
          : '',
    [tokenFromPath, tokenFromQuery],
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'form' | 'success'>('form');

  const confirmMismatch =
    confirmPassword.length > 0 && newPassword.length > 0 && newPassword !== confirmPassword;

  const newPasswordPolicyInvalid = newPassword.length > 0 && !isPasswordPolicyOk(newPassword);

  const canSubmit =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword &&
    isPasswordPolicyOk(newPassword);

  const { mutate: submitReset, isPending } = useMutation({
    ...authMutations.resetPassword(),
    onSuccess: () => {
      setServerError(null);
      setPhase('success');
    },
    onError: () => {
      setServerError('비밀번호 변경에 실패했습니다. 링크가 만료되었거나 잘못되었을 수 있습니다.');
    },
  });

  const handleChangePassword = () => {
    if (!token || !canSubmit) return;
    setServerError(null);
    submitReset({ token, newPassword });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center">
        <div className="my-[6rem] flex w-full max-w-[35.2rem] flex-col gap-[1.8rem]">
          <p className="W_Title text-left text-black">비밀번호 재설정</p>
          <div className="rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
            <p className="W_R15 text-gray-90">
              유효하지 않은 링크입니다. 이메일에 포함된 주소를 다시 확인하거나, 비밀번호 찾기를 다시
              진행해 주세요.
            </p>
          </div>
          <Link to="/find-account" className="W_SB15 text-center text-primary hover:underline">
            아이디·비밀번호 찾기로 이동
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="flex items-center justify-center">
        <div className="my-[10rem] flex w-full max-w-[35.2rem] flex-col items-center gap-[2rem]">
          <div className="flex w-full flex-col items-center gap-[2rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
            <img src={tomyongjiCheck} alt="" className="h-[6.6rem] w-[6.6rem]" />
            <p className="W_Title text-center text-black">비밀번호 재설정 완료</p>
            <Button
              variant="primary"
              size="regular"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              로그인하러 가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="my-[6rem] flex w-full max-w-[35.2rem] flex-col gap-[1.8rem]">
        <p className="W_Title text-left text-black">비밀번호 재설정</p>

        <div className="flex flex-col gap-[1.6rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]">
          <div className="flex w-full flex-col gap-[0.6rem]">
            <div className="flex w-full items-center gap-[1rem]">
              <p className="W_B15 w-[9.6rem] shrink-0 text-left text-gray-90">새 비밀번호</p>
              <TextField
                type="password"
                placeholder="새 비밀번호"
                className="w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isError={newPasswordPolicyInvalid}
              />
            </div>
            {newPasswordPolicyInvalid && (
              <p className="W_SB12 pl-[10.6rem] text-error">
                비밀번호는 8~20자이며 특수문자를 한 개 이상 포함해야 합니다.
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-[0.6rem]">
            <div className="flex w-full items-center gap-[1rem]">
              <p className="W_B15 w-[9.6rem] shrink-0 text-left text-gray-90">비밀번호 확인</p>
              <TextField
                type="password"
                placeholder="비밀번호 확인"
                className="w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isError={confirmMismatch}
              />
            </div>
            {confirmMismatch && (
              <p className="W_SB12 pl-[10.6rem] text-error">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {serverError && <p className="W_SB12 text-error">{serverError}</p>}
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full"
          disabled={!canSubmit || isPending}
          onClick={handleChangePassword}
        >
          {isPending ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
