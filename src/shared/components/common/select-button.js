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
import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';
import { cn } from '@libs/cn';
import { cva } from 'class-variance-authority';
const selectButtonVariants = cva('W_M15 flex h-[4rem] w-[30rem] cursor-pointer items-center justify-between rounded-[1rem] py-[0.8rem] pr-[1rem] pl-[1.4rem] outline-none transition-colors', {
    variants: {
        status: {
            // 1) 기본 상태
            default: 'border-1 border-gray-20 bg-white text-gray-70 hover:bg-gray-50 active:bg-background active:text-black',
            // 2) 열림 상태 (드롭다운 펼침)
            selecting: 'border-1 border-primary bg-white text-gray-70',
            // 3) 선택 완료 상태
            filled: 'border-1 border-primary bg-white text-black hover:bg-gray-50 active:bg-background',
        },
    },
    defaultVariants: {
        status: 'default',
    },
});
export function SelectButton(_a) {
    var { className, status, value, placeholder = '선택해주세요', isOpen = false, ref } = _a, props = __rest(_a, ["className", "status", "value", "placeholder", "isOpen", "ref"]);
    // 우선순위: isOpen > value > default
    const currentStatus = status || (isOpen ? 'selecting' : value ? 'filled' : 'default');
    return (_jsxs("button", Object.assign({ ref: ref, type: "button", className: cn(selectButtonVariants({ status: currentStatus, className })) }, props, { children: [_jsx("span", { children: value || placeholder }), _jsx("span", { className: cn('text-gray-20 transition-transform', isOpen && 'rotate-180'), children: _jsx(ArrowDownIcon, { width: 20, height: 20 }) })] })));
}
export default SelectButton;
