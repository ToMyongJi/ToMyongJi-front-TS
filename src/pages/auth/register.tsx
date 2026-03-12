import { authApi } from '@apis/auth/auth';
import { Button } from '@components/common/button';
import SelectButton from '@components/common/select-button';
import TextField from '@components/common/textfield';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';

const registerSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  studentNum: z.string().min(1, { message: '학번을 입력해주세요.' }),
  collegeName: z.string().min(1, { message: '대학을 선택해주세요.' }),
  studentClubId: z.number().min(1, { message: '소속을 선택해주세요.' }),
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: '특수문자가 적어도 한 개 포함되어야 합니다.' }),
  role: z.string().min(1, { message: '자격을 선택해주세요.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      userId: '',
      password: '',
      email: '',
      name: '',
      studentNum: '',
      collegeName: '샘플대학교',
      role: '샘플자격',
      studentClubId: 1,
    },
  });

  // 실시간으로 가져온 값 -> 추후 대학, 자격, 소속 선택 상태 관리 필요
  const userId = watch('userId');
  const email = watch('email');

  // 대학, 자격, 소속 선택 상태
  const [collegeOpen, setCollegeOpen] = useState<boolean>(false);
  const [roleOpen, setRoleOpen] = useState<boolean>(false);
  const [studentClubOpen, setStudentClubOpen] = useState<boolean>(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState<string>('');

  const [isIdChecked, setIsIdChecked] = useState(false);

  const handleIdCheck = async () => {
    if (!userId) return;
    try {
      await authApi.idCheck(userId);
      setIsIdChecked(true);
      clearErrors('userId');
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError('userId', {
          type: 'manual',
          message: '중복된 아이디입니다.',
        });
        return;
      }
      setError('userId', {
        type: 'manual',
        message: '아이디 중복 확인 중 오류가 발생했습니다.',
      });
    }
  };

  const onSubmit = (data: RegisterFormValues) => {
    console.log('회원가입 데이터:', data);
  };

  return (
    <div className="mt-[4.2rem] mb-[10rem] flex flex-col items-center justify-center">
      <div className="w-full max-w-[42rem] gap-[1.6rem]">
        <div className="mb-[1.8rem]">
          <p className="W_Title text-black">회원가입</p>
        </div>
        <div className="w-full max-w-[42rem]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-[1.6rem]">
            {/* 첫 번째 그룹: 계정 정보 */}
            <div className="flex flex-col gap-[1.6rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]">
              {/* 아이디 */}
              <div className="flex w-[36.6rem] flex-col gap-[1rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">아이디</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      {...register('userId')}
                      isError={!!errors.userId}
                      disabled={isIdChecked}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[8.9rem]"
                      disabled={!userId || isIdChecked}
                      onClick={handleIdCheck}
                    >
                      중복확인
                    </Button>
                  </div>
                </div>
                {errors.userId ? (
                  <p className="W_R12 text-error">{errors.userId.message}</p>
                ) : isIdChecked ? (
                  <p className="W_R12 text-green-600">사용 가능한 아이디입니다.</p>
                ) : null}
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-[0.4rem]">
                <div className="flex items-center gap-[1rem]">
                  <p className="W_B15 text-gray-90">비밀번호</p>
                  <TextField
                    className="w-[3rem] flex-1"
                    {...register('password')}
                    isError={!!errors.password}
                  />
                </div>
                <p className="W_R12 text-gray-70">
                  * 영문 대·소문자, 숫자, 특수기호를 모두 포함하여 8자~20자로 작성
                </p>
              </div>

              {/* 이메일 & 인증코드 */}
              <div className="flex w-[36.6rem] flex-col gap-[1rem]">
                <div className="flex items-center gap-[1rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">이메일</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      {...register('email')}
                      isError={!!errors.email}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[9.2rem]"
                      disabled={!email || !!errors.email}
                      onClick={() => {
                        console.log('코드 발송');
                      }}
                    >
                      코드 발송
                    </Button>
                  </div>
                </div>

                {/* 인증코드 */}
                <div className="flex items-center gap-[1rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">인증코드</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      value={emailVerificationCode}
                      onChange={(e) => setEmailVerificationCode(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[9.2rem]"
                      disabled={!emailVerificationCode}
                    >
                      인증하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 두 번째 그룹: 개인 정보 */}
            <div className="flex flex-col gap-[2rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]">
              {/* 이름 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_SB15 w-[5.6rem] text-gray-90">이름</p>
                  <TextField className="w-[30rem]" {...register('name')} isError={!!errors.name} />
                </div>
              </div>

              {/* 학번 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_SB15 w-[5.6rem] text-gray-90">학번</p>
                  <TextField
                    className="w-[30rem]"
                    {...register('studentNum')}
                    isError={!!errors.studentNum}
                  />
                </div>
              </div>

              {/* 대학 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_SB15 w-[5.6rem] text-gray-90">대학</p>
                  <SelectButton
                    placeholder="대학을 선택해주세요"
                    className="w-[30rem]"
                    isOpen={collegeOpen}
                    onClick={() => setCollegeOpen(!collegeOpen)}
                  />
                </div>
              </div>

              {/* 자격 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_SB15 w-[5.6rem] text-gray-90">자격</p>
                  <SelectButton
                    className="w-[30rem]"
                    placeholder="자격을 선택해주세요"
                    isOpen={roleOpen}
                    onClick={() => setRoleOpen(!roleOpen)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_SB15 w-[5.6rem] text-gray-90">소속</p>
                  <div className="flex flex-1 gap-[0.8rem]">
                    <SelectButton
                      className="w-[20rem]"
                      placeholder="소속을 선택해주세요"
                      isOpen={studentClubOpen}
                      onClick={() => setStudentClubOpen(!studentClubOpen)}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[8.9rem]"
                      disabled={!studentClubOpen}
                    >
                      인증하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-[1.2rem]">
              <Link to="/login">
                <Button type="button" variant="gray_outline" size="md" className="w-[12rem]">
                  취소
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-[12rem]"
                disabled={!isValid || isSubmitting}
              >
                가입하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
