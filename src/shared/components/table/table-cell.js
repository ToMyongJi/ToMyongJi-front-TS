import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@libs/cn';
import CheckBox from '@components/common/check-box';
import IconButton from '@components/common/icon-button';
const formatAmount = (value) => (value !== null && value !== void 0 ? value : 0).toLocaleString('ko-KR');
const TableCell = ({ type, date, content, deposit, withdrawal }) => {
    const tdStyle = 'W_M15 text-gray-90 text-center py-[1rem]';
    return (_jsx("tbody", { children: _jsxs("tr", { className: "border-gray-10 border-b-1", children: [type === 'EDIT' && _jsx("td", { children: _jsx(CheckBox, {}) }), _jsx("td", { className: tdStyle, children: date }), _jsx("td", { className: cn(tdStyle, 'text-start'), children: content }), _jsx("td", { className: cn(tdStyle, "text-success"), children: formatAmount(deposit) }), _jsx("td", { className: cn(tdStyle, "text-error-deep"), children: formatAmount(withdrawal) }), type === 'EDIT' && _jsx("td", { children: _jsx(IconButton, { iconType: 'edit' }) })] }) }));
};
export default TableCell;
