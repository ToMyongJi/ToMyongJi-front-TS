import { Button } from '@components/common/button';
import TextField from '@components/common/textfield';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';

const registerSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
    .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: '특수문자가 적어도 한 개 포함되어야 합니다.' }),
  email: z.email({ message: '올바른 이메일 형식이 아닙니다.' }),
  verificationCode: z.string().min(1, { message: '인증코드를 입력해주세요.' }),
  name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  studentId: z.string().min(1, { message: '학번을 입력해주세요.' }),
  college: z.string().min(1, { message: '대학을 선택해주세요.' }),
  qualification: z.string().min(1, { message: '자격을 선택해주세요.' }),
  affiliation: z.string().min(1, { message: '소속을 선택해주세요.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userId: '',
      password: '',
      email: '',
      verificationCode: '',
      name: '',
      studentId: '',
      college: '',
      qualification: '',
      affiliation: '',
    },
  });

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
              <div className="flex w-[36.6rem] gap-[1rem]">
                {/* 아이디 */}
                <div className="flex items-center gap-[1.6rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">아이디</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      {...register('userId')}
                      isError={!!errors.userId}
                    />
                    <Button type="button" variant="primary" size="regular" className="w-[8.9rem]">
                      중복확인
                    </Button>
                  </div>
                </div>
                {errors.userId && (
                  <p className="W_SB12 ml-[7.6rem] text-error">{errors.userId.message}</p>
                )}
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
                {errors.password && (
                  <p className="W_SB12 ml-[7.6rem] text-error">{errors.password.message}</p>
                )}
              </div>

              {/* 이메일  & 인증코드*/}
              <div className="flex w-[36.6rem] flex-col gap-[1rem]">
                <div className="flex items-center gap-[1rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">이메일</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      {...register('email')}
                      isError={!!errors.email}
                    />
                    <Button type="button" variant="primary" size="regular" className="w-[9.2rem]">
                      코드 발송
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-[1rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">인증코드</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      {...register('verificationCode')}
                      isError={!!errors.verificationCode}
                    />
                    <Button type="button" variant="primary" size="regular" className="w-[9.2rem]">
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
                  <label className="W_SB14 w-[6rem] text-primary">이름</label>
                  <TextField
                    className="flex-1"
                    placeholder="이름"
                    {...register('name')}
                    isError={!!errors.name}
                  />
                </div>
                {errors.name && (
                  <p className="W_SB12 ml-[7.6rem] text-error">{errors.name.message}</p>
                )}
              </div>

              {/* 학번 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <label className="W_SB14 w-[6rem] text-gray-80">학번</label>
                  <TextField
                    className="flex-1"
                    placeholder="학번"
                    {...register('studentId')}
                    isError={!!errors.studentId}
                  />
                </div>
                {errors.studentId && (
                  <p className="W_SB12 ml-[7.6rem] text-error">{errors.studentId.message}</p>
                )}
              </div>

              {/* 대학, 자격, 소속 (현재는 TextField로 임시 구현, 추후 Select 컴포넌트로 교체 필요) */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <label className="W_SB14 w-[6rem] text-gray-80">대학</label>
                  <TextField
                    className="flex-1"
                    placeholder="대학을 선택해주세요"
                    {...register('college')}
                    isError={!!errors.college}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <label className="W_SB14 w-[6rem] text-gray-80">자격</label>
                  <TextField
                    className="flex-1"
                    placeholder="자격을 선택해주세요"
                    {...register('qualification')}
                    isError={!!errors.qualification}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-center gap-[1.6rem]">
                  <label className="W_SB14 w-[6rem] text-gray-80">소속</label>
                  <div className="flex flex-1 gap-[0.8rem]">
                    <TextField
                      className="flex-1"
                      placeholder="소속을 선택해주세요"
                      {...register('affiliation')}
                      isError={!!errors.affiliation}
                    />
                    <Button type="button" variant="primary" size="sm" className="w-[8.6rem]">
                      인증하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
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
                disabled={isSubmitting}
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
