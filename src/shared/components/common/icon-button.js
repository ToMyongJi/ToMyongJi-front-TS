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
import { jsx as _jsx } from "react/jsx-runtime";
import CloseIcon from '@assets/icons/cancel.svg?react';
import EditIcon from '@assets/icons/edit.svg?react';
import { Button } from '@components/common/button';
import { cn } from '@libs/cn';
export function IconButton(_a) {
    var { iconType, className, type = 'button', ref } = _a, props = __rest(_a, ["iconType", "className", "type", "ref"]);
    // 타입에 따른 아이콘 매핑
    const iconMap = {
        edit: _jsx(EditIcon, { width: 16, height: 16 }),
        cancel: _jsx(CloseIcon, { width: 15, height: 16 }),
    };
    return (_jsx(Button, Object.assign({ ref: ref, type: type, variant: "gray_outline", className: cn('!p-0 h-[3rem] w-[3rem] flex-shrink-0 rounded-[0.8rem]', className) }, props, { children: iconMap[iconType] })));
}
export default IconButton;
