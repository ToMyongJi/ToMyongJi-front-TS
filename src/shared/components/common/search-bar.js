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
import SearchIcon from '@assets/icons/search.svg?react';
import { cn } from '@libs/cn';
import { useState } from 'react';
export function SearchBar(_a) {
    var { className, value, onChange, ref } = _a, props = __rest(_a, ["className", "value", "onChange", "ref"]);
    const [isFocused, setIsFocused] = useState(false);
    // ✅ 추가됨: 내부적으로 사용자가 입력한 값을 추적하기 위한 state
    const [internalValue, setInternalValue] = useState(value || '');
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = value !== undefined && value !== '' && value !== null;
    // 입력 변경 시 이벤트 핸들러
    const handleChange = (e) => {
        // 내부 state 업데이트 (이를 통해 hasValue가 다시 계산됨)
        setInternalValue(e.target.value);
        // 외부에서 전달받은 onChange가 있다면 호출
        onChange === null || onChange === void 0 ? void 0 : onChange(e);
    };
    return (_jsxs("div", { className: cn('flex h-[4rem] w-[30rem] items-center justify-between rounded-[3rem] border-[1px] bg-white py-[0.8rem] pr-[1.6rem] pl-[2rem] transition-colors', isFocused ? 'border-primary' : 'border-gray-20', className), children: [_jsx("input", Object.assign({ ref: ref, type: "text", value: currentValue, className: cn('W_R14 h-full w-full bg-transparent outline-none placeholder:text-gray-70', hasValue ? 'text-black' : 'text-gray-70'), onFocus: () => {
                    setIsFocused(true);
                }, onBlur: () => {
                    setIsFocused(false);
                }, onChange: handleChange }, props)), _jsx("button", { type: "button", className: "flex flex-shrink-0 cursor-pointer items-center justify-center outline-none", children: _jsx(SearchIcon, { width: 20, height: 20 }) })] }));
}
export default SearchBar;
