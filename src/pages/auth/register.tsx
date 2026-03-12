import { authApi } from '@apis/auth/auth';
import { authMutations } from '@apis/auth/auth-mutations';
import { collegeQuery } from '@apis/college/college-queries';
import { Button } from '@components/common/button';
import SelectButton from '@components/common/select-button';
import TextField from '@components/common/textfield';
import Role from '@constants/role';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as z from 'zod';

const ROLE_OPTIONS = [
  { label: '학생회장', value: Role.PRESIDENT },
  { label: '부원', value: Role.STU },
] as const;

type OpenDropdown = 'college' | 'role' | 'studentClub' | null;

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
    setValue,
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
      collegeName: '',
      role: '',
      studentClubId: 0,
    },
  });

  const sendEmailMutation = useMutation(authMutations.sendEmail());
  const emailCheckMutation = useMutation(authMutations.emailCheck());
  const clubVerifyMutation = useMutation(authMutations.clubVerify());

  const userId = watch('userId');
  const email = watch('email');

  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null);

  const { data: collegeData } = useQuery(collegeQuery.collegeAndClubs());
  const colleges = collegeData?.data ?? [];

  const { data: clubData } = useQuery({
    ...collegeQuery.getCollegeByClub(selectedCollegeId ?? 0),
    enabled: selectedCollegeId !== null,
  });
  const studentClubOptions = clubData?.data ?? [];

  // 대학, 자격, 소속 선택 상태
  const [emailVerificationCode, setEmailVerificationCode] = useState<string>('');

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailMessageType, setEmailMessageType] = useState<'success' | 'error' | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const [selectedStudentClub, setSelectedStudentClub] = useState('');

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const toggleDropdown = (target: Exclude<OpenDropdown, null>) => {
    setOpenDropdown((prev) => (prev === target ? null : target));
  };

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

  const handleSendEmail = () => {
    if (!email || !!errors.email || isEmailVerified) return;

    sendEmailMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setIsEmailSent(true);
          setEmailMessage('인증코드를 발송했습니다. 이메일을 확인해주세요.');
          setEmailMessageType('success');
        },
        onError: () => {
          setIsEmailSent(false);
          setIsEmailVerified(false);
          setEmailMessage('이메일 발송에 실패했습니다. 다시 시도해주세요.');
          setEmailMessageType('error');
        },
      },
    );
  };

  const handleEmailCheck = () => {
    if (!emailVerificationCode || isEmailVerified) return;

    emailCheckMutation.mutate(
      { email, code: emailVerificationCode },
      {
        onSuccess: (res) => {
          if (res.data === true) {
            setIsEmailVerified(true);
            setEmailMessageType('success');
            setEmailMessage('이메일 인증이 완료되었습니다.');
          } else {
            setIsEmailVerified(false);
            setEmailMessageType('error');
            setEmailMessage('인증코드가 올바르지 않습니다.');
          }
        },
        onError: () => {
          setIsEmailVerified(false);
          setEmailMessageType('error');
          setEmailMessage('인증코드 확인에 실패했습니다.');
        },
      },
    );
  };
  const handleClubVerify = () => {
    if (!watch('studentClubId') || !watch('collegeName') || !watch('role')) return;
    clubVerifyMutation.mutate(
      {
        clubId: watch('studentClubId'),
        studentNum: watch('studentNum'),
        role: watch('role') as Role,
      },
      {
        onSuccess: () => {
          setError('studentClubId', {
            type: 'manual',
            message: '소속 인증이 완료되었습니다.',
          });
        },
        onError: () => {
          setError('studentClubId', {
            type: 'manual',
            message: '소속 인증에 실패했습니다.',
          });
        },
      },
    );
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
                      {...register('email', {
                        onChange: () => {
                          setIsEmailSent(false);
                          setIsEmailVerified(false);
                          setEmailVerificationCode('');
                          setEmailMessage('');
                          setEmailMessageType(null);
                          clearErrors('email');
                        },
                      })}
                      isError={!!errors.email || emailMessageType === 'error'}
                      disabled={isEmailVerified}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[9.2rem]"
                      disabled={
                        !email || !!errors.email || sendEmailMutation.isPending || isEmailSent
                      }
                      onClick={handleSendEmail}
                    >
                      {sendEmailMutation.isPending ? '발송 중...' : '코드 발송'}
                    </Button>
                  </div>
                </div>
                {emailMessageType && (
                  <p
                    className={`W_R12 ${emailMessageType === 'success' ? 'text-green-600' : 'text-error'}`}
                  >
                    {emailMessage}
                  </p>
                )}

                {/* 인증코드 */}
                <div className="flex items-center gap-[1rem]">
                  <p className="W_B15 w-[5.6rem] text-gray-90">인증코드</p>
                  <div className="flex gap-[1rem]">
                    <TextField
                      className="w-[20rem]"
                      value={emailVerificationCode}
                      onChange={(e) => setEmailVerificationCode(e.target.value)}
                      disabled={!isEmailSent || isEmailVerified}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[9.2rem]"
                      disabled={
                        !emailVerificationCode ||
                        !isEmailSent ||
                        isEmailVerified ||
                        emailCheckMutation.isPending
                      }
                      onClick={handleEmailCheck}
                    >
                      {isEmailVerified
                        ? '인증완료'
                        : emailCheckMutation.isPending
                          ? '확인 중...'
                          : '인증하기'}
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
                <div className="flex items-start gap-[1.6rem]">
                  <p className="W_SB15 mt-[1rem] w-[5.6rem] text-gray-90">대학</p>

                  <div className="relative w-[30rem]">
                    <SelectButton
                      className="w-full"
                      value={selectedCollege}
                      placeholder="대학을 선택해주세요"
                      isOpen={openDropdown === 'college'}
                      onClick={() => toggleDropdown('college')}
                    />

                    {openDropdown === 'college' && (
                      <ul className="absolute top-[calc(100%+0.4rem)] left-0 z-30 w-full overflow-y-auto rounded-[1rem] border-1 border-gray-20 bg-white shadow-sm">
                        {colleges.map((college) => (
                          <li key={college.collegeId}>
                            <button
                              type="button"
                              className="W_M15 w-full cursor-pointer py-[1rem] pr-[1rem] pl-[1.4rem] text-left text-gray-90 hover:bg-background"
                              onClick={() => {
                                setSelectedCollege(college.collegeName); // 화면 표시용
                                setSelectedCollegeId(college.collegeId); // API 조회용
                                setValue('collegeName', college.collegeName, {
                                  shouldValidate: true,
                                });
                                setSelectedStudentClub('');
                                setValue('studentClubId', 0, { shouldValidate: true });
                                setOpenDropdown(null);
                              }}
                            >
                              {college.collegeName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* 자격 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-start gap-[1.6rem]">
                  <p className="W_SB15 mt-[1rem] w-[5.6rem] text-gray-90">자격</p>

                  <div className="relative w-[30rem]">
                    <SelectButton
                      className="w-full"
                      value={selectedRole}
                      placeholder="자격을 선택해주세요"
                      isOpen={openDropdown === 'role'}
                      onClick={() => toggleDropdown('role')}
                    />

                    {openDropdown === 'role' && (
                      <ul className="absolute top-[calc(100%+0.4rem)] left-0 z-30 w-full overflow-hidden rounded-[1rem] border border-gray-20 bg-white py-[0.8rem] shadow-sm">
                        {ROLE_OPTIONS.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              className="W_M15 w-full px-[2rem] py-[1rem] text-left text-gray-90 hover:bg-gray-50"
                              onClick={() => {
                                setSelectedRole(option.label);
                                setValue('role', option.value, { shouldValidate: true });
                                setOpenDropdown(null);
                              }}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* 소속 */}
              <div className="flex flex-col gap-[0.8rem]">
                <div className="flex items-start gap-[1.6rem]">
                  <p className="W_SB15 mt-[1rem] w-[5.6rem] text-gray-90">소속</p>

                  <div className="flex flex-1 gap-[0.8rem]">
                    <div className="relative">
                      <SelectButton
                        className="w-[20rem]"
                        value={selectedStudentClub}
                        placeholder={
                          selectedCollege ? '소속을 선택해주세요' : '대학을 먼저 선택해주세요'
                        }
                        isOpen={openDropdown === 'studentClub'}
                        onClick={() => {
                          if (!selectedCollege) return;
                          toggleDropdown('studentClub');
                        }}
                      />

                      {openDropdown === 'studentClub' && (
                        <ul className="absolute top-[calc(100%+0.4rem)] left-0 z-30 overflow-hidden rounded-[1rem] border border-gray-20 bg-white shadow-sm">
                          {studentClubOptions.length === 0 ? (
                            <li className="W_M15 px-[1.4rem] py-[1rem] text-gray-60">
                              조회된 소속이 없습니다.
                            </li>
                          ) : (
                            studentClubOptions.map((club) => (
                              <li key={club.studentClubId}>
                                <button
                                  type="button"
                                  className="W_M15 w-full cursor-pointer py-[1rem] pr-[1rem] pl-[1.4rem] text-left text-gray-90 hover:bg-background"
                                  onClick={() => {
                                    setSelectedStudentClub(club.studentClubName);
                                    setValue('studentClubId', club.studentClubId, {
                                      shouldValidate: true,
                                    });
                                    setOpenDropdown(null);
                                  }}
                                >
                                  {club.studentClubName}
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="regular"
                      className="w-[8.9rem]"
                      disabled={!watch('studentClubId') || watch('studentClubId') < 1}
                      onClick={handleClubVerify}
                    >
                      인증하기
                    </Button>
                  </div>
                </div>
                {errors.studentClubId ? (
                  <p className="W_R12 text-center text-error">{errors.studentClubId.message}</p>
                ) : clubVerifyMutation.isSuccess ? (
                  <p className="W_R12 text-center text-green-600">소속 인증이 완료되었습니다.</p>
                ) : null}
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
