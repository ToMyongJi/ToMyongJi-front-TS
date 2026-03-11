import type { authLoginResponse } from '@apis/auth/auth';
import { authMutations } from '@apis/auth/auth-mutations';
import { myApi } from '@apis/my/my';
import { Button } from '@components/common/button';
import CheckBox from '@components/common/check-box';
import TextField from '@components/common/textfield';
import { zodResolver } from '@hookform/resolvers/zod';
import { decodeToken } from '@libs/token';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from 'src/shared/store/auth-store';
import useUserStore from 'src/shared/store/user-store';
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

  const navigate = useNavigate();
  const loginMutation = useMutation(authMutations.login());

  const setAuthData = useAuthStore((state) => state.setAuthData);
  const setUser = useUserStore((state) => state.setUser);

  const userId = watch('userId');
  const password = watch('password');
  const isButtonDisabled = !userId || !password;

  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = (data: LoginFormValues) => {
    console.log('로그인 시도 데이터:', data);

    loginMutation.mutate(data, {
      onSuccess: async (response: authLoginResponse) => {
        const { grantType, accessToken, refreshToken } = response.data;

        // 1. 토큰 저장
        setAuthData(grantType, accessToken, refreshToken);
        // 2. 토큰 디코딩
        const decodedPayload = decodeToken(accessToken);

        if (decodedPayload) {
          const { id, role } = decodedPayload;

          try {
            const myInfoResponse = await myApi.getMyInfo(id);

            const myInfo = myInfoResponse.data;
            setUser({
              id: id,
              userId: userId,
              role: role,
              name: myInfo.name,
              studentNum: myInfo.studentNum,
              college: myInfo.college,
              studentClubId: myInfo.studentClubId,
            });
          } catch (error) {
            console.error('내 정보 조회 실패:', error);
          }
        } else {
          console.error('토큰 디코딩에 실패하여 유저 정보를 저장하지 못했습니다.');
        }

        // 5. 메인 페이지로 이동
        navigate('/');
      },
      onError: () => {
        // 에러 처리
        setError('root.serverError', {
          type: 'server',
          message: '아이디 또는 비밀번호를 다시 확인해 주세요',
        });
      },
    });
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
