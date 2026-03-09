import Button from '@components/button';
import CheckBox from '@components/check-box';
import TextField from '@components/textfield';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';

const loginSchema = z.object({
  id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z
    .string()
    .min(1, { message: '비밀번호를 입력해주세요.' })
    .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: '',
      password: '',
      rememberMe: false,
    },
  });
  // watch를 통해 현재 입력된 아이디와 비밀번호 값을 실시간으로 가져옵니다.
  const id = watch('id');
  const password = watch('password');
  // 둘 중 하나라도 비어있으면 true를 반환하는 변수를 만듭니다.
  const isButtonDisabled = !id || !password;

  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = (data: LoginFormValues) => {
    console.log('로그인 시도 데이터:', data);
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
              {...register('id')}
              isError={!!errors.id}
            />
            {/* 비밀번호 입력 영역 */}
            <TextField
              type="default"
              placeholder="비밀번호"
              {...register('password')}
              isError={!!errors.password}
            />
          </div>

          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex cursor-pointer items-center space-x-[0.2rem]">
              <CheckBox checked={rememberMe} onChange={(checked) => setRememberMe(checked)} />
              <span className="W_SB12 text-gray-90">아이디 저장</span>
            </div>
            <Link to="/find-account" className="W_SB12 text-gray-90">
              아이디·비밀번호 찾기
            </Link>
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
