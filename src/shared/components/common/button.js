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
import { cva } from 'class-variance-authority';
const buttonVariants = cva('inline-flex disable:cursor-not-allowed items-center justify-center gap-[1rem] rounded-[1rem] transition-colors hover:cursor-pointer disabled:bg-gray-20 disabled:text-gray-70', {
    variants: {
        variant: {
            primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary-deep disabled:text-white',
            primary_outline: 'border-1 border-primary bg-white text-primary active:bg-background disabled:border-none',
            danger: 'bg-error text-white hover:bg-error/90 active:bg-error-deep disabled:text-white',
            gray: 'bg-gray-10 text-gray-80 disabled:text-gray-80',
            gray_outline: 'border-1 border-gray-20 bg-white text-black text-black active:bg-background disabled:bg-background',
        },
        size: {
            sm: 'W_M14 h-[3.2rem] px-[1.8rem] py-[1.5rem]',
            md: 'W_SB15 h-[4rem] px-[1.8rem] py-[1.5rem]',
            regular: 'W_SB15 h-[3.6rem] px-[1.8rem] py-[1.5rem]',
            save: 'W_M14 h-[4rem] px-[1.8rem] py-[1.5rem]',
        },
        fullWidth: {
            true: 'w-full',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});
export function Button(_a) {
    var { className, variant, size, fullWidth, ref } = _a, props = __rest(_a, ["className", "variant", "size", "fullWidth", "ref"]);
    return (_jsx("button", Object.assign({ ref: ref, className: cn(buttonVariants({ variant, size, fullWidth, className })) }, props)));
}
export default Button;
