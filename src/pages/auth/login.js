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
const Login = () => {
    var _a, _b, _c;
    const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting }, } = useForm({
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
    const onSubmit = (data) => {
        console.log('로그인 시도 데이터:', data);
        loginMutation.mutate(data, {
            onSuccess: (response) => __awaiter(void 0, void 0, void 0, function* () {
                const { grantType, accessToken, refreshToken } = response.data;
                // 1. 토큰 저장
                setAuthData(grantType, accessToken, refreshToken);
                // 2. 토큰 디코딩
                const decodedPayload = decodeToken(accessToken);
                if (decodedPayload) {
                    const { id, auth: role } = decodedPayload;
                    try {
                        const myInfoResponse = yield myApi.getMyInfo(id);
                        const myInfo = myInfoResponse.data;
                        setUser({
                            id: id,
                            userId: userId,
                            role,
                            name: myInfo.name,
                            studentNum: myInfo.studentNum,
                            college: myInfo.college,
                            studentClubId: myInfo.studentClubId,
                        });
                        if (role === 'ADMIN') {
                            navigate('/home-admin');
                        }
                        else {
                            navigate('/');
                        }
                        return;
                    }
                    catch (error) {
                        console.error('내 정보 조회 실패:', error);
                    }
                }
                else {
                    console.error('토큰 디코딩에 실패하여 유저 정보를 저장하지 못했습니다.');
                }
                navigate('/');
            }),
            onError: () => {
                setError('root.serverError', {
                    type: 'server',
                    message: '아이디 또는 비밀번호를 다시 확인해 주세요',
                });
            },
        });
    };
    return (_jsxs("div", { className: "mt-[4.2rem] flex flex-col items-center justify-center", children: [_jsx("div", { className: "my-[6rem]", children: _jsx("p", { className: "W_Header text-black", children: "\uB85C\uADF8\uC778" }) }), _jsxs("div", { className: "w-full max-w-[35.2rem] px-[2.6rem] py-[3rem]", children: [_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-[1.6rem]", children: [_jsxs("div", { className: "flex flex-col gap-[1rem]", children: [_jsx(TextField, Object.assign({ type: "default", placeholder: "\uC544\uC774\uB514" }, register('userId'), { isError: !!errors.userId || !!((_a = errors.root) === null || _a === void 0 ? void 0 : _a.serverError) })), _jsx(TextField, Object.assign({ type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638" }, register('password'), { isError: !!errors.password || !!((_b = errors.root) === null || _b === void 0 ? void 0 : _b.serverError) })), ((_c = errors.root) === null || _c === void 0 ? void 0 : _c.serverError) && (_jsx("p", { className: "W_SB12 text-error", children: errors.root.serverError.message }))] }), _jsxs("div", { className: "W_SB12 flex items-center justify-between text-gray-90", children: [_jsxs("div", { className: "flex cursor-pointer items-center space-x-[0.2rem]", children: [_jsx(CheckBox, { checked: rememberMe, onChange: (checked) => setRememberMe(checked) }), _jsx("span", { children: "\uC544\uC774\uB514 \uC800\uC7A5" })] }), _jsx(Link, { to: "/find-account", children: "\uC544\uC774\uB514 \uCC3E\uAE30" })] }), _jsx(Button, { variant: "primary", size: "md", type: "submit", disabled: isSubmitting || isButtonDisabled, className: "w-full", children: isSubmitting ? '로그인 중...' : '로그인' })] }), _jsx("div", { className: "mt-[1.6rem] text-center text-sm", children: _jsx(Link, { to: "/register", className: "W_SB12 text-gray-90", children: "\uD68C\uC6D0\uAC00\uC785" }) })] })] }));
};
export default Login;
