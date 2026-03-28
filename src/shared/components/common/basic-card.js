import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@libs/cn';
const BasicCard = ({ children, className }) => {
    return (_jsx("div", { className: cn('rounded-[1rem] border border-gray-20', className), children: children }));
};
export default BasicCard;
