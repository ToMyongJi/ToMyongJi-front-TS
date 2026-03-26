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
import CheckIcon from '@assets/icons/check.svg?react';
import { cn } from '@libs/cn';
export function CheckBox(_a) {
    var { className, checked = false, onChange, ref, disabled } = _a, props = __rest(_a, ["className", "checked", "onChange", "ref", "disabled"]);
    return (_jsxs("label", { className: cn('inline-flex cursor-pointer items-center', disabled && 'cursor-not-allowed', className), children: [_jsx("input", Object.assign({ type: "checkbox", ref: ref, className: "hidden", checked: checked, onChange: (e) => onChange === null || onChange === void 0 ? void 0 : onChange(e.target.checked), disabled: disabled }, props)), _jsx("div", { className: cn('flex h-[2rem] w-[2rem] items-center justify-center border-1 transition-colors', // 크기나 모서리(rounded)는 디자인 수치에 맞게 조절하세요.
                checked
                    ? 'border-primary bg-white' // 체크되었을 때 (이미지처럼 테두리 파란색, 배경 흰색)
                    : 'border-gray-20 bg-white'), children: checked && _jsx(CheckIcon, { width: 14, height: 10 }) })] }));
}
export default CheckBox;
