import Button from '@components/button';
import CheckBox from '@components/check-box';
import TextField from '@components/textfield';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';

const loginSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });
  // watch를 통해 현재 입력된 아이디와 비밀번호 값을 실시간으로 가져옵니다.
  const userId = watch('userId');
  const password = watch('password');
  // 둘 중 하나라도 비어있으면 true를 반환하는 변수를 만듭니다.
  const isButtonDisabled = !userId || !password;

  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = (data: LoginFormValues) => {
    console.log('로그인 시도 데이터:', data);
    try {
      // API 호출 로직이 들어갈 자리입니다.
      // const response = await api.login(data);

      // 강제로 실패를 시뮬레이션 해보겠습니다.
      throw new Error('Login failed');
    } catch {
      // 2. API 실패 시 두 필드 모두에 에러를 설정하고,
      // root(전역 폼 에러)에 메시지를 세팅합니다.
      setError('userId', { type: 'manual' });
      setError('password', { type: 'manual' });
      setError('root.serverError', {
        type: 'server',
        message: '아이디 또는 비밀번호를 다시 확인해 주세요',
      });
    }
  };

  return (
    <div className="mt-[4.2rem] flex flex-col items-center justify-center">
      <div className="my-[6rem]">
        <p className="W_Header text-black">로그인</p>
      </div>
      <div className="w-full max-w-[35.2rem] px-[2.6rem] py-[3rem]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[1.6rem]">
          <div className="flex flex-col gap-[1rem]">
            {/* 아이디 입력 영역 */}
            <TextField
              type="default"
              placeholder="아이디"
              {...register('userId')}
              isError={!!errors.userId || !!errors.root?.serverError}
            />
            {/* 비밀번호 입력 영역 */}
            <TextField
              type="default"
              placeholder="비밀번호"
              {...register('password')}
              isError={!!errors.password || !!errors.root?.serverError}
            />
            {errors.root?.serverError && (
              <p className="W_SB12 text-error">{errors.root.serverError.message}</p>
            )}
          </div>

          <div className="W_SB12 flex items-center justify-between text-gray-90">
            <div className="flex cursor-pointer items-center space-x-[0.2rem]">
              <CheckBox checked={rememberMe} onChange={(checked) => setRememberMe(checked)} />
              <span>아이디 저장</span>
            </div>
            <Link to="/find-account">아이디·비밀번호 찾기</Link>
          </div>

          {/* 로그인 버튼 (피그마 디자인에 맞춰 색상 지정, disabled 처리 포함) */}
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting || isButtonDisabled}
            className="w-full"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        {/* 회원가입 링크 */}
        <div className="mt-[1.6rem] text-center text-sm">
          <Link to="/register" className="W_SB12 text-gray-90">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
