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
import ArrowDownIcon from '@assets/icons/arrow-up.svg?react';
import { cn } from '@libs/cn';
export function Chip(_a) {
    var { className, label, isActive = false, ref } = _a, props = __rest(_a, ["className", "label", "isActive", "ref"]);
    return (_jsxs("button", Object.assign({ ref: ref, type: "button", className: cn('W_M14 inline-flex h-[3.6rem] cursor-pointer items-center justify-center gap-[0.4rem] rounded-[3rem] border-1 border-gray-20 bg-white py-[0.8rem] pr-[1rem] pl-[1.4rem] hover:bg-background', className) }, props, { children: [_jsx("span", { className: "W_M14 text-gray-90", children: label }), _jsx("span", { className: cn('flex items-center justify-center', isActive ? 'rotate-0' : 'rotate-180'), children: _jsx(ArrowDownIcon, { width: 20, height: 20, className: "text-gray-20" }) })] })));
}
export default Chip;
