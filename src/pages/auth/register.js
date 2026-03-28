var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';
const ROLE_OPTIONS = [
    { label: '학생회장', value: Role.PRESIDENT },
    { label: '부원', value: Role.STU },
];
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
    role: z.nativeEnum(Role),
});
const Register = () => {
    var _a, _b;
    const { register, handleSubmit, watch, setValue, setError, clearErrors, formState: { errors, isValid, isSubmitting }, } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            userId: '',
            password: '',
            email: '',
            name: '',
            studentNum: '',
            collegeName: '',
            role: Role.STU,
            studentClubId: 0,
        },
    });
    const signupMutation = useMutation(authMutations.signup());
    const sendEmailMutation = useMutation(authMutations.sendEmail());
    const emailCheckMutation = useMutation(authMutations.emailCheck());
    const clubVerifyMutation = useMutation(authMutations.clubVerify());
    const navigate = useNavigate();
    const userId = watch('userId');
    const email = watch('email');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedCollegeId, setSelectedCollegeId] = useState(null);
    const { data: collegeData } = useQuery(collegeQuery.collegeAndClubs());
    const colleges = (_a = collegeData === null || collegeData === void 0 ? void 0 : collegeData.data) !== null && _a !== void 0 ? _a : [];
    const { data: clubData } = useQuery(Object.assign(Object.assign({}, collegeQuery.getCollegeByClub(selectedCollegeId !== null && selectedCollegeId !== void 0 ? selectedCollegeId : 0)), { enabled: selectedCollegeId !== null }));
    const studentClubOptions = (_b = clubData === null || clubData === void 0 ? void 0 : clubData.data) !== null && _b !== void 0 ? _b : [];
    // 대학, 자격, 소속 선택 상태
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');
    const [emailMessageType, setEmailMessageType] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [isClubVerified, setIsClubVerified] = useState(false);
    const [selectedStudentClub, setSelectedStudentClub] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const toggleDropdown = (target) => {
        setOpenDropdown((prev) => (prev === target ? null : target));
    };
    const handleIdCheck = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!userId)
            return;
        try {
            yield authApi.idCheck(userId);
            setIsIdChecked(true);
            clearErrors('userId');
        }
        catch (error) {
            if (isAxiosError(error) && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
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
    });
    const handleSendEmail = () => {
        if (!email || !!errors.email || isEmailVerified)
            return;
        sendEmailMutation.mutate({ email }, {
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
        });
    };
    const handleEmailCheck = () => {
        if (!emailVerificationCode || isEmailVerified)
            return;
        emailCheckMutation.mutate({ email, code: emailVerificationCode }, {
            onSuccess: (res) => {
                if (res.data === true) {
                    setIsEmailVerified(true);
                    setEmailMessageType('success');
                    setEmailMessage('이메일 인증이 완료되었습니다.');
                }
                else {
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
        });
    };
    const handleClubVerify = () => {
        if (!watch('studentClubId') || !watch('collegeName') || !watch('role'))
            return;
        clearErrors('studentClubId');
        clubVerifyMutation.mutate({
            clubId: watch('studentClubId'),
            studentNum: watch('studentNum'),
            role: watch('role'),
        }, {
            onSuccess: () => {
                setIsClubVerified(true);
            },
            onError: () => {
                setError('studentClubId', {
                    type: 'manual',
                    message: '소속 인증에 실패했습니다.',
                });
                setIsClubVerified(false);
            },
        });
    };
    const onSubmit = (data) => {
        console.log('회원가입 데이터:', data);
        signupMutation.mutate(data, {
            onSuccess: () => {
                navigate('/login');
            },
            onError: () => {
                setError('root', { type: 'manual', message: '회원가입에 실패했습니다.' });
            },
        });
    };
    return (_jsx("div", { className: "mt-[4.2rem] mb-[10rem] flex flex-col items-center justify-center", children: _jsxs("div", { className: "w-full max-w-[42rem] gap-[1.6rem]", children: [_jsx("div", { className: "mb-[1.8rem]", children: _jsx("p", { className: "W_Title text-black", children: "\uD68C\uC6D0\uAC00\uC785" }) }), _jsx("div", { className: "w-full max-w-[42rem]", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-[1.6rem]", children: [_jsxs("div", { className: "flex flex-col gap-[1.6rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]", children: [_jsxs("div", { className: "flex w-[36.6rem] flex-col gap-[1rem]", children: [_jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx("p", { className: "W_B15 w-[5.6rem] text-gray-90", children: "\uC544\uC774\uB514" }), _jsxs("div", { className: "flex gap-[1rem]", children: [_jsx(TextField, Object.assign({ className: "w-[20rem]" }, register('userId'), { isError: !!errors.userId, disabled: isIdChecked })), _jsx(Button, { type: "button", variant: "primary", size: "regular", className: "w-[8.9rem]", disabled: !userId || isIdChecked, onClick: handleIdCheck, children: "\uC911\uBCF5\uD655\uC778" })] })] }), errors.userId ? (_jsx("p", { className: "W_R12 text-error", children: errors.userId.message })) : isIdChecked ? (_jsx("p", { className: "W_R12 text-green-600", children: "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC544\uC774\uB514\uC785\uB2C8\uB2E4." })) : null] }), _jsxs("div", { className: "flex flex-col gap-[0.4rem]", children: [_jsxs("div", { className: "flex items-center gap-[1rem]", children: [_jsx("p", { className: "W_B15 text-gray-90", children: "\uBE44\uBC00\uBC88\uD638" }), _jsx(TextField, Object.assign({ className: "w-[3rem] flex-1" }, register('password'), { isError: !!errors.password }))] }), _jsx("p", { className: "W_R12 text-gray-70", children: "* \uC601\uBB38 \uB300\u00B7\uC18C\uBB38\uC790, \uC22B\uC790, \uD2B9\uC218\uAE30\uD638\uB97C \uBAA8\uB450 \uD3EC\uD568\uD558\uC5EC 8\uC790~20\uC790\uB85C \uC791\uC131" })] }), _jsxs("div", { className: "flex w-[36.6rem] flex-col gap-[1rem]", children: [_jsxs("div", { className: "flex items-center gap-[1rem]", children: [_jsx("p", { className: "W_B15 w-[5.6rem] text-gray-90", children: "\uC774\uBA54\uC77C" }), _jsxs("div", { className: "flex gap-[1rem]", children: [_jsx(TextField, Object.assign({ className: "w-[20rem]" }, register('email', {
                                                                onChange: () => {
                                                                    setIsEmailSent(false);
                                                                    setIsEmailVerified(false);
                                                                    setEmailVerificationCode('');
                                                                    setEmailMessage('');
                                                                    setEmailMessageType(null);
                                                                    clearErrors('email');
                                                                },
                                                            }), { isError: !!errors.email || emailMessageType === 'error', disabled: isEmailVerified })), _jsx(Button, { type: "button", variant: "primary", size: "regular", className: "w-[9.2rem]", disabled: !email || !!errors.email || sendEmailMutation.isPending || isEmailSent, onClick: handleSendEmail, children: sendEmailMutation.isPending ? '발송 중...' : '코드 발송' })] })] }), emailMessageType && (_jsx("p", { className: `W_R12 ${emailMessageType === 'success' ? 'text-green-600' : 'text-error'}`, children: emailMessage })), _jsxs("div", { className: "flex items-center gap-[1rem]", children: [_jsx("p", { className: "W_B15 w-[5.6rem] text-gray-90", children: "\uC778\uC99D\uCF54\uB4DC" }), _jsxs("div", { className: "flex gap-[1rem]", children: [_jsx(TextField, { className: "w-[20rem]", value: emailVerificationCode, onChange: (e) => setEmailVerificationCode(e.target.value), disabled: !isEmailSent || isEmailVerified }), _jsx(Button, { type: "button", variant: "primary", size: "regular", className: "w-[9.2rem]", disabled: !emailVerificationCode ||
                                                                    !isEmailSent ||
                                                                    isEmailVerified ||
                                                                    emailCheckMutation.isPending, onClick: handleEmailCheck, children: isEmailVerified
                                                                    ? '인증완료'
                                                                    : emailCheckMutation.isPending
                                                                        ? '확인 중...'
                                                                        : '인증하기' })] })] })] })] }), _jsxs("div", { className: "flex flex-col gap-[2rem] rounded-[1rem] border border-gray-20 px-[2.6rem] py-[3rem]", children: [_jsx("div", { className: "flex flex-col gap-[0.8rem]", children: _jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx("p", { className: "W_SB15 w-[5.6rem] text-gray-90", children: "\uC774\uB984" }), _jsx(TextField, Object.assign({ className: "w-[30rem]" }, register('name'), { isError: !!errors.name }))] }) }), _jsx("div", { className: "flex flex-col gap-[0.8rem]", children: _jsxs("div", { className: "flex items-center gap-[1.6rem]", children: [_jsx("p", { className: "W_SB15 w-[5.6rem] text-gray-90", children: "\uD559\uBC88" }), _jsx(TextField, Object.assign({ className: "w-[30rem]" }, register('studentNum'), { isError: !!errors.studentNum }))] }) }), _jsx("div", { className: "flex flex-col gap-[0.8rem]", children: _jsxs("div", { className: "flex items-start gap-[1.6rem]", children: [_jsx("p", { className: "W_SB15 mt-[1rem] w-[5.6rem] text-gray-90", children: "\uB300\uD559" }), _jsxs("div", { className: "relative w-[30rem]", children: [_jsx(SelectButton, { className: "w-full", value: selectedCollege, placeholder: "\uB300\uD559\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694", isOpen: openDropdown === 'college', onClick: () => toggleDropdown('college') }), openDropdown === 'college' && (_jsx("ul", { className: "absolute top-[calc(100%+0.4rem)] left-0 z-30 w-full overflow-y-auto rounded-[1rem] border-1 border-gray-20 bg-white shadow-sm", children: colleges.map((college) => (_jsx("li", { children: _jsx("button", { type: "button", className: "W_M15 w-full cursor-pointer py-[1rem] pr-[1rem] pl-[1.4rem] text-left text-gray-90 hover:bg-background", onClick: () => {
                                                                        setSelectedCollege(college.collegeName); // 화면 표시용
                                                                        setSelectedCollegeId(college.collegeId); // API 조회용
                                                                        setValue('collegeName', college.collegeName, {
                                                                            shouldValidate: true,
                                                                        });
                                                                        setSelectedStudentClub('');
                                                                        setValue('studentClubId', 0, { shouldValidate: true });
                                                                        setOpenDropdown(null);
                                                                    }, children: college.collegeName }) }, college.collegeId))) }))] })] }) }), _jsx("div", { className: "flex flex-col gap-[0.8rem]", children: _jsxs("div", { className: "flex items-start gap-[1.6rem]", children: [_jsx("p", { className: "W_SB15 mt-[1rem] w-[5.6rem] text-gray-90", children: "\uC790\uACA9" }), _jsxs("div", { className: "relative w-[30rem]", children: [_jsx(SelectButton, { className: "w-full", value: selectedRole, placeholder: "\uC790\uACA9\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694", isOpen: openDropdown === 'role', onClick: () => toggleDropdown('role') }), openDropdown === 'role' && (_jsx("ul", { className: "absolute top-[calc(100%+0.4rem)] left-0 z-30 w-full overflow-hidden rounded-[1rem] border border-gray-20 bg-white py-[0.8rem] shadow-sm", children: ROLE_OPTIONS.map((option) => (_jsx("li", { children: _jsx("button", { type: "button", className: "W_M15 w-full px-[2rem] py-[1rem] text-left text-gray-90 hover:bg-gray-50", onClick: () => {
                                                                        setSelectedRole(option.label);
                                                                        setValue('role', option.value, { shouldValidate: true });
                                                                        setOpenDropdown(null);
                                                                    }, children: option.label }) }, option.value))) }))] })] }) }), _jsxs("div", { className: "flex flex-col gap-[0.8rem]", children: [_jsxs("div", { className: "flex items-start gap-[1.6rem]", children: [_jsx("p", { className: "W_SB15 mt-[1rem] w-[5.6rem] text-gray-90", children: "\uC18C\uC18D" }), _jsxs("div", { className: "flex flex-1 gap-[0.8rem]", children: [_jsxs("div", { className: "relative", children: [_jsx(SelectButton, { className: "w-[20rem]", value: selectedStudentClub, placeholder: selectedCollege ? '소속을 선택해주세요' : '대학을 먼저 선택해주세요', isOpen: openDropdown === 'studentClub', onClick: () => {
                                                                            if (!selectedCollege)
                                                                                return;
                                                                            toggleDropdown('studentClub');
                                                                        } }), openDropdown === 'studentClub' && (_jsx("ul", { className: "absolute top-[calc(100%+0.4rem)] left-0 z-30 overflow-hidden rounded-[1rem] border border-gray-20 bg-white shadow-sm", children: studentClubOptions.length === 0 ? (_jsx("li", { className: "W_M15 px-[1.4rem] py-[1rem] text-gray-60", children: "\uC870\uD68C\uB41C \uC18C\uC18D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) : (studentClubOptions.map((club) => (_jsx("li", { children: _jsx("button", { type: "button", className: "W_M15 w-full cursor-pointer py-[1rem] pr-[1rem] pl-[1.4rem] text-left text-gray-90 hover:bg-background", onClick: () => {
                                                                                    setSelectedStudentClub(club.studentClubName);
                                                                                    setValue('studentClubId', club.studentClubId, {
                                                                                        shouldValidate: true,
                                                                                    });
                                                                                    setIsClubVerified(false); // 소속이 바뀌면 인증 초기화
                                                                                    setOpenDropdown(null);
                                                                                }, children: club.studentClubName }) }, club.studentClubId)))) }))] }), _jsx(Button, { type: "button", variant: "primary", size: "regular", className: "w-[8.9rem]", disabled: !watch('studentClubId') || watch('studentClubId') < 1, onClick: handleClubVerify, children: "\uC778\uC99D\uD558\uAE30" })] })] }), errors.studentClubId ? (_jsx("p", { className: "W_R12 text-center text-error", children: errors.studentClubId.message })) : clubVerifyMutation.isSuccess ? (_jsx("p", { className: "W_R12 text-center text-green-600", children: "\uC18C\uC18D \uC778\uC99D\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4." })) : null] })] }), _jsxs("div", { className: "flex justify-end gap-[1.2rem]", children: [_jsx(Link, { to: "/login", children: _jsx(Button, { type: "button", variant: "gray_outline", size: "md", className: "w-[12rem]", children: "\uCDE8\uC18C" }) }), _jsx(Button, { type: "submit", variant: "primary", size: "md", className: "w-[12rem]", disabled: !isValid || isSubmitting || !isClubVerified, children: "\uAC00\uC785\uD558\uAE30" })] })] }) })] }) }));
};
export default Register;
