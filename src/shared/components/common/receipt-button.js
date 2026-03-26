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
import ExcelIcon from '@assets/icons/excel.svg?react';
import TossIcon from '@assets/icons/toss-bank.png';
import { Button } from '@components/common/button';
import { cn } from '@libs/cn';
export function ReceiptButton(_a) {
    var { className, receiptType, fullWidth, ref } = _a, props = __rest(_a, ["className", "receiptType", "fullWidth", "ref"]);
    const config = {
        toss: {
            text: '거래내역서 추가',
            icon: _jsx("img", { src: TossIcon, alt: "TossIcon", width: 99, height: 22 }),
        },
        excel: {
            text: 'Excel 데이터 추가',
            icon: _jsx(ExcelIcon, { width: 17, height: 16 }),
        },
    };
    const currentConfig = config[receiptType];
    return (_jsxs(Button, Object.assign({ ref: ref, variant: "primary_outline", size: "regular", fullWidth: fullWidth, className: cn('justify-center gap-[0.6rem]', className) }, props, { children: [currentConfig.icon, _jsx("span", { className: "text-gray-90", children: currentConfig.text })] })));
}
export default ReceiptButton;
