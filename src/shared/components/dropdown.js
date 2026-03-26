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
import { cn } from '@libs/cn';
const Dropdown = (_a) => {
    var { datas, previewData, setPreViewData, className, onClick } = _a, props = __rest(_a, ["datas", "previewData", "setPreViewData", "className", "onClick"]);
    return (_jsx("div", { className: cn('flex-col rounded-[4px] border border-gray-70 bg-white', className), children: datas === null || datas === void 0 ? void 0 : datas.map((data) => (_jsx("button", Object.assign({ type: "button", onClick: (event) => {
                setPreViewData(data);
                onClick === null || onClick === void 0 ? void 0 : onClick(event);
            }, className: cn('W_M14 w-[9.6rem] p-[1rem] text-start hover:bg-background', previewData === data && 'bg-background') }, props, { children: data }), data))) }));
};
export default Dropdown;
