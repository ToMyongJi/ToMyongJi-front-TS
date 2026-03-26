import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@libs/cn';
import ArrowLeftIcon from "@assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "@assets/icons/arrow-right.svg?react";
const PaginationButton = ({ isActive, content, onClick }) => {
    return (_jsx("button", { type: "button", onClick: onClick, className: cn('W_SB14 w-[3rem] cursor-pointer rounded-full p-[0.7rem] text-gray-70', isActive && "bg-background text-black"), children: content }));
};
const PaginationIconButton = ({ isDisabled, Icon, onClick }) => {
    return (_jsx("button", { type: "button", disabled: isDisabled, onClick: onClick, className: cn('cursor-pointer', isDisabled && 'text-gray-20'), children: _jsx(Icon, {}) }));
};
const PaginationCustom = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    if (totalPages === 0) {
        pageNumbers.push(0);
    }
    else {
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    }
    return (_jsxs("div", { className: "flex-row-center gap-[0.4rem]", children: [_jsx(PaginationIconButton, { isDisabled: currentPage === 1 || totalPages === 0, onClick: () => onPageChange(currentPage - 1), Icon: ArrowLeftIcon }), pageNumbers.map((pageNumber) => (_jsx(PaginationButton, { onClick: () => totalPages > 0 && onPageChange(pageNumber), isActive: pageNumber === currentPage, content: pageNumber }, pageNumber))), _jsx(PaginationIconButton, { isDisabled: currentPage === totalPages || totalPages === 0, onClick: () => onPageChange(currentPage + 1), Icon: ArrowRightIcon })] }));
};
export default PaginationCustom;
