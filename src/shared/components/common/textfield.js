var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@libs/cn';
import { useState } from 'react';
export function TextField(_a) {
    var { className, value, type = 'default', isError = false, disabled = false, onChange, onBlur, ref } = _a, props = __rest(_a, ["className", "value", "type", "isError", "disabled", "onChange", "onBlur", "ref"]);
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    const currentValue = value !== undefined ? value : internalValue;
    const handleChange = (e) => {
        setInternalValue(e.target.value);
        onChange === null || onChange === void 0 ? void 0 : onChange(e);
    };
    return (_jsxs("div", { className: cn(
        // 컨테이너 공통 스타일
        'flex h-[4rem] items-center rounded-[0.8rem] border-[1px] px-[1.4rem] py-[0.8rem] transition-colors active:border-primary', 
        // 배경색 분기: disabled면 회색, 아니면 흰색
        disabled ? 'border-none bg-background' : 'border-gray-10 bg-white', type === 'price' ? 'w-[14.6rem]' : '', 
        // 테두리 분기 로직
        !disabled && (isError ? 'border-error' : isFocused ? 'border-primary' : 'border-gray-20'), className), children: [_jsx("input", Object.assign({ ref: ref, type: type === 'password' ? 'password' : 'text', value: currentValue, disabled: disabled, className: cn('W_R15 h-full w-full bg-transparent outline-none placeholder:text-gray-70', disabled && 'text-black'), onFocus: () => {
                    setIsFocused(true);
                }, onBlur: (e) => {
                    setIsFocused(false);
                    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                }, onChange: handleChange }, props)), type === 'price' && (_jsx("span", { className: cn('W_B15 ml-[0.8rem] flex-shrink-0 select-none text-black'), children: "\uC6D0" }))] }));
}
export default TextField;
