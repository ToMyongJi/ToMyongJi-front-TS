import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { receiptQueries } from '@apis/receipt/receipt-queries';
import { useStudentClubStore } from '@store/studentClubStore';
import { useLayoutStore } from '@store/layoutStore';
import dayjs from 'dayjs';
import InfoIcon from "@assets/icons/info.svg?react";
import MenuIcon from "@assets/icons/menu.svg?react";
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import Chip from '@components/common/chip';
import SearchBar from '@components/common/search-bar';
import PaginationCustom from '@components/pagination-custom';
import Dropdown from '@components/dropdown';
const HeaderData = [
    { labels: "날짜", width: "15.8%" },
    { labels: "내용", width: "51%" },
    { labels: "입금", width: "16.6%" },
    { labels: "출금", width: "16.6%" },
];
const ReceiptView = () => {
    var _a, _b, _c, _d, _e;
    const [year, setYear] = useState("전체(년)");
    const [yearFilter, setYearFilter] = useState(false);
    const [month, setMonth] = useState("전체(월)");
    const [monthFilter, setMonthFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { toggleSidebar } = useLayoutStore();
    const clubData = useStudentClubStore((state) => state.selectedClub);
    const clubId = clubData === null || clubData === void 0 ? void 0 : clubData.studentClubId;
    const selectedYear = year === '전체(년)' ? undefined : Number(year.replace('년', ''));
    const selectedMonth = month === '전체(월)' ? undefined : Number(month.replace('월', ''));
    const receiptList = useInfiniteQuery(Object.assign(Object.assign({}, receiptQueries.listInfinite(clubId, selectedYear, selectedMonth, 10, page - 1)), { enabled: !!clubId }));
    console.log('receiptList', receiptList);
    const totalPages = (_c = (_b = (_a = receiptList.data) === null || _a === void 0 ? void 0 : _a.pages[0]) === null || _b === void 0 ? void 0 : _b.data.totalPages) !== null && _c !== void 0 ? _c : 0;
    const receipts = (_e = (_d = receiptList.data) === null || _d === void 0 ? void 0 : _d.pages.flatMap((p) => { var _a, _b; return (_b = (_a = p === null || p === void 0 ? void 0 : p.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []; })) !== null && _e !== void 0 ? _e : [];
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    const normalizedReceipts = receipts.filter((item) => Boolean(item));
    const filteredReceipts = trimmedSearchTerm.length < 2
        ? normalizedReceipts
        : normalizedReceipts.filter((item) => {
            const target = `${item.date} ${item.content} ${item.deposit} ${item.withdrawal}`.toLowerCase();
            return target.includes(trimmedSearchTerm);
        });
    const yearOptions = ['전체(년)', ...Array.from({ length: 5 }, (_, i) => `${dayjs().year() - 2 + i}년`)];
    const monthOptions = ['전체(월)', ...Array.from({ length: 12 }, (_, i) => `${i + 1}월`)];
    const handleChipClick = (type) => {
        type === 'YEAR' ? setYearFilter(true) : setMonthFilter(true);
    };
    return (_jsxs("div", { className: "mb-[10rem] flex-col gap-[4.6rem] px-[3rem] pt-[4.2rem] xl:px-[9.3rem]", children: [_jsxs("section", { className: "flex-row-between", children: [_jsxs("div", { className: "flex items-center gap-[0.8rem]", children: [_jsx("p", { className: "W_Header text-black", children: clubData === null || clubData === void 0 ? void 0 : clubData.studentClubName }), _jsx(InfoIcon, { className: "text-gray-20" })] }), _jsx("button", { type: "button", className: "cursor-pointer", children: _jsx(MenuIcon, { className: 'md:hidden', onClick: toggleSidebar }) })] }), _jsxs("div", { className: "flex-col gap-[1rem]", children: [_jsxs("section", { className: "flex-row-between", children: [_jsxs("div", { className: "flex gap-[0.8rem]", children: [_jsxs("div", { className: "relative", children: [_jsx(Chip, { label: year, isActive: yearFilter, onClick: () => handleChipClick('YEAR') }), yearFilter &&
                                                _jsx(Dropdown, { className: "absolute top-0", onClick: () => setYearFilter(false), datas: yearOptions, previewData: year, setPreViewData: setYear })] }), _jsxs("div", { className: "relative", children: [_jsx(Chip, { label: month, isActive: monthFilter, onClick: () => handleChipClick('MONTH') }), monthFilter &&
                                                _jsx(Dropdown, { className: "absolute top-0", onClick: () => setMonthFilter(false), datas: monthOptions, previewData: month, setPreViewData: setMonth })] })] }), _jsx(SearchBar, { placeholder: "\uAC80\uC0C9\uC5B4 2\uAE00\uC790 \uC774\uC0C1 \uC785\uB825", value: searchTerm, onChange: (e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1);
                                } })] }), _jsx("section", { className: "rounded-[1rem] border border-gray-20 px-[2.6rem] xl:px-[10rem]", children: _jsxs("div", { className: "pt-[1.6rem]", children: [_jsxs("table", { className: "w-full table-fixed", children: [_jsx(TableHeader, { headerData: HeaderData }), filteredReceipts.map((item, index) => (_jsx(TableCell, Object.assign({ type: 'VIEW' }, item), item.receiptId !== null && item.receiptId !== void 0 ? item.receiptId : `${item.date}-${index}`)))] }), _jsx("div", { className: "py-[1.6rem]", children: _jsx(PaginationCustom, { currentPage: page, totalPages: totalPages, onPageChange: (pageNumber) => setPage(pageNumber) }) })] }) })] })] }));
};
export default ReceiptView;
