import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { authApi } from '@apis/auth/auth';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FindAccount = () => {
    const [email, setEmail] = useState('');
    const isValidEmail = emailRegex.test(email);
    const [foundId, setFoundId] = useState();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { mutate: findId } = useMutation({
        mutationFn: (email) => authApi.findId({ email }),
        onSuccess: (data) => {
            setFoundId(data.data);
        },
        onError: () => {
            setError('등록되지 않은 이메일입니다.');
        },
    });
    const handleFindAccount = () => {
        findId(email);
    };
    return (_jsx("div", { className: "flex items-center justify-center", children: _jsxs("div", { className: "my-[6rem] flex w-full max-w-[35.2rem] flex-col gap-[1.8rem]", children: [_jsx("p", { className: "W_Title text-left text-black", children: "\uC544\uC774\uB514 \uCC3E\uAE30" }), _jsxs("div", { className: "flex flex-col items-center gap-[1.6rem] rounded-[1rem] border-1 border-gray-20 px-[2.6rem] py-[3rem]", children: [_jsxs("div", { className: "flex w-full items-center gap-[1rem]", children: [_jsx("p", { className: "W_B15 w-[5.6rem] text-left text-gray-90", children: "\uC774\uBA54\uC77C" }), _jsx(TextField, { type: "default", placeholder: "\uC774\uBA54\uC77C", className: "w-full", value: email, onChange: (e) => setEmail(e.target.value) })] }), foundId ? (_jsxs("p", { className: "W_SB12 w-full text-left text-black", children: ["\uD574\uB2F9 \uC774\uBA54\uC77C\uB85C \uB4F1\uB85D\uB41C \uC544\uC774\uB514\uB294 ", _jsx("span", { className: "W_SB12 text-black", children: foundId }), "\uC785\uB2C8\uB2E4."] })) : (_jsx("p", { className: "W_SB12 w-full text-left text-error", children: error }))] }), _jsx(Button, { variant: "primary", size: "md", className: "w-full", disabled: !isValidEmail && !foundId, onClick: foundId ? () => navigate('/login') : handleFindAccount, children: foundId ? '확인' : '아이디 찾기' })] }) }));
};
export default FindAccount;
