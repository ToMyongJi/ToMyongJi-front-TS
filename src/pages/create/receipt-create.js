var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '@apis/base/key';
import { receiptMutations } from '@apis/receipt/receipt-mutations';
import { receiptQueries } from '@apis/receipt/receipt-queries';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useUserStore from '@store/user-store';
import useStudentClubStore from '@store/student-club-store';
import useAuthStore from '@store/auth-store';
import ReceiptButton from '@components/common/receipt-button';
import TextField from '@components/common/textfield';
import Button from '@components/common/button';
import Chip from '@components/common/chip';
import SearchBar from '@components/common/search-bar';
import Dropdown from '@components/dropdown';
import TableHeader from '@components/table/table-header';
import TableCell from '@components/table/table-cell';
import PaginationCustom from '@components/pagination-custom';
const parseWonInput = (raw) => {
    const digits = raw.replace(/,/g, '').replace(/\D/g, '');
    return digits === '' ? 0 : Number(digits);
};
const HEADER_DATA = [
    { labels: "", width: "8.46%" },
    { labels: "날짜", width: "12.8%" },
    { labels: "내용", width: "41.27%" },
    { labels: "입금", width: "13.42%" },
    { labels: "출금", width: "13.42%" },
    { labels: "", width: "8.46%" },
];
const ReceiptCreate = () => {
    var _a, _b, _c, _d, _e, _f;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { authData } = useAuthStore();
    const { allClubsFlat, getClubNameById, fetchClubs } = useStudentClubStore();
    const { data } = useQuery(Object.assign({}, receiptQueries.club(user === null || user === void 0 ? void 0 : user.id)));
    const [receiptForm, setReceiptForm] = useState({
        date: new Date(),
        content: '',
        deposit: '',
        withdrawal: '',
    });
    const [year, setYear] = useState('전체(년)');
    const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
    const [month, setMonth] = useState('전체(월)');
    const [isMonthFilterOpen, setIsMonthFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedReceiptIds, setSelectedReceiptIds] = useState([]);
    const yearOptions = ['전체(년)', ...Array.from({ length: 5 }, (_, i) => `${dayjs().year() - 2 + i}년`)];
    const monthOptions = ['전체(월)', ...Array.from({ length: 12 }, (_, i) => `${i + 1}월`)];
    const receiptData = data === null || data === void 0 ? void 0 : data.data;
    const selectedYear = year === '전체(년)' ? undefined : Number(year.replace('년', ''));
    const selectedMonth = month === '전체(월)' ? undefined : Number(month.replace('월', ''));
    const receiptList = useInfiniteQuery(Object.assign({}, receiptQueries.listInfinite(user === null || user === void 0 ? void 0 : user.studentClubId, selectedYear, selectedMonth, 10, page - 1)));
    const totalPages = (_c = (_b = (_a = receiptList.data) === null || _a === void 0 ? void 0 : _a.pages[0]) === null || _b === void 0 ? void 0 : _b.data.totalPages) !== null && _c !== void 0 ? _c : 0;
    const receipts = (_e = (_d = receiptList.data) === null || _d === void 0 ? void 0 : _d.pages.reduce((acc, p) => {
        var _a;
        const payload = p.data;
        const list = (_a = payload.receiptDtoList) !== null && _a !== void 0 ? _a : [];
        return acc.concat(list);
    }, [])) !== null && _e !== void 0 ? _e : [];
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredReceipts = trimmedSearchTerm.length < 2
        ? receipts
        : receipts.filter((item) => {
            const target = `${item.date} ${item.content} ${item.deposit} ${item.withdrawal}`.toLowerCase();
            return target.includes(trimmedSearchTerm);
        });
    const createReceipt = useMutation(Object.assign(Object.assign({}, receiptMutations.create()), { onSuccess: () => {
            if ((user === null || user === void 0 ? void 0 : user.id) != null) {
                queryClient.invalidateQueries({ queryKey: QK.receipt.club(user.id) });
            }
            if ((user === null || user === void 0 ? void 0 : user.studentClubId) != null) {
                queryClient.invalidateQueries({ queryKey: ['receiptList', user.studentClubId] });
            }
            setReceiptForm((prev) => (Object.assign(Object.assign({}, prev), { content: '', deposit: '', withdrawal: '' })));
        }, onError: () => {
            alert('내역 저장에 실패했습니다.');
        } }));
    const deleteReceipt = useMutation(Object.assign({}, receiptMutations.delete()));
    const updateReceipt = useMutation(Object.assign(Object.assign({}, receiptMutations.update()), { onSuccess: () => {
            if ((user === null || user === void 0 ? void 0 : user.id) != null) {
                queryClient.invalidateQueries({ queryKey: QK.receipt.club(user.id) });
            }
            if ((user === null || user === void 0 ? void 0 : user.studentClubId) != null) {
                queryClient.invalidateQueries({ queryKey: ['receiptList', user.studentClubId] });
            }
        }, onError: () => {
            alert('내역 수정에 실패했습니다.');
        } }));
    useEffect(() => {
        if (authData && allClubsFlat.length === 0) {
            fetchClubs();
        }
    }, [authData, allClubsFlat.length, fetchClubs]);
    const studentClubName = (user === null || user === void 0 ? void 0 : user.studentClubId) != null ? getClubNameById(user.studentClubId) : '';
    const handleChipClick = (type) => {
        if (type === 'YEAR') {
            setIsYearFilterOpen(true);
            return;
        }
        setIsMonthFilterOpen(true);
    };
    const handleCheckClick = (id, state) => {
        setSelectedReceiptIds((prev) => state ? [...prev, id] : prev.filter((receiptId) => receiptId !== id));
    };
    const handleReceiptDelete = () => __awaiter(void 0, void 0, void 0, function* () {
        if (selectedReceiptIds.length === 0) {
            alert('삭제할 내역을 선택해 주세요.');
            return;
        }
        try {
            yield Promise.all(selectedReceiptIds.map((receiptId) => deleteReceipt.mutateAsync(receiptId)));
            if ((user === null || user === void 0 ? void 0 : user.id) != null) {
                queryClient.invalidateQueries({ queryKey: QK.receipt.club(user.id) });
            }
            if ((user === null || user === void 0 ? void 0 : user.studentClubId) != null) {
                queryClient.invalidateQueries({ queryKey: ['receiptList', user.studentClubId] });
            }
            setSelectedReceiptIds([]);
            alert('성공적으로 삭제했습니다.');
        }
        catch (_a) {
            alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
    });
    const handleSaveClick = () => {
        if ((user === null || user === void 0 ? void 0 : user.id) == null || user.userId == null) {
            alert('로그인 정보를 확인할 수 없습니다.');
            return;
        }
        if (receiptForm.date == null) {
            alert('날짜를 선택해 주세요.');
            return;
        }
        const trimmedContent = receiptForm.content.trim();
        if (!trimmedContent) {
            alert('내용을 입력해 주세요.');
            return;
        }
        createReceipt.mutate({
            userId: user.userId,
            date: receiptForm.date.toISOString(),
            content: trimmedContent,
            deposit: parseWonInput(receiptForm.deposit),
            withdrawal: parseWonInput(receiptForm.withdrawal),
        });
    };
    return (_jsx("div", { className: "flex w-full flex-col px-[3rem] pt-[4.2rem] pb-[10rem]", children: _jsxs("div", { className: "mx-auto w-full max-w-[100rem] flex-col gap-[7.2rem]", children: [_jsxs("section", { className: "flex-col gap-[1.2rem]", children: [_jsx("p", { className: "W_Header", children: studentClubName }), _jsx("div", { children: _jsxs("p", { className: "W_Header", children: [_jsx("span", { className: "W_R14 text-gray-80", children: "\uC794\uC561" }), " ", ((_f = receiptData === null || receiptData === void 0 ? void 0 : receiptData.balance) !== null && _f !== void 0 ? _f : 0).toLocaleString(), "\uC6D0"] }) })] }), _jsxs("section", { className: "flex-col gap-[1rem]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "W_Title", children: "\uB0B4\uC5ED \uCD94\uAC00" }), _jsxs("div", { className: "flex items-center gap-[0.8rem]", children: [_jsx(ReceiptButton, { receiptType: "toss", onClick: () => navigate('/tossbank-create') }), _jsx(ReceiptButton, { receiptType: "excel" })] })] }), _jsxs("div", { className: "flex-row-center gap-[0.8rem] rounded-[10px] border border-gray-20 p-[2rem]", children: [_jsx("div", { className: "flex h-[4rem] w-[11.2rem] shrink-0 items-center rounded-[0.8rem] border-[1px] border-gray-20 bg-white px-[1.4rem] py-[0.8rem] transition-colors focus-within:border-primary", children: _jsx(DatePicker, { selected: receiptForm.date, onChange: (date) => {
                                            setReceiptForm((prev) => (Object.assign(Object.assign({}, prev), { date })));
                                        }, dateFormat: "yyyy.MM.dd", popperPlacement: "bottom", popperClassName: "receipt-datepicker-popper", calendarClassName: "receipt-datepicker-calendar", className: "W_R15 w-full bg-transparent outline-none placeholder:text-gray-70" }) }), _jsx(TextField, { placeholder: "\uB0B4\uC6A9", className: "w-[41.4rem]", value: receiptForm.content, onChange: (e) => setReceiptForm((prev) => (Object.assign(Object.assign({}, prev), { content: e.target.value }))) }), _jsx(TextField, { type: "price", placeholder: "\uC785\uAE08", value: receiptForm.deposit, onChange: (e) => setReceiptForm((prev) => (Object.assign(Object.assign({}, prev), { deposit: e.target.value }))) }), _jsx(TextField, { type: "price", placeholder: "\uCD9C\uAE08", value: receiptForm.withdrawal, onChange: (e) => setReceiptForm((prev) => (Object.assign(Object.assign({}, prev), { withdrawal: e.target.value }))) }), _jsx(Button, { variant: "primary", size: "save", disabled: createReceipt.isPending, onClick: handleSaveClick, children: "\uC800\uC7A5\uD558\uAE30" })] })] }), _jsxs("section", { className: "flex-col gap-[1rem]", children: [_jsx("p", { className: "W_Title", children: "\uD559\uC0DD\uD68C\uBE44 \uC0AC\uC6A9 \uB0B4\uC5ED" }), _jsxs("div", { className: "flex-row-between", children: [_jsxs("div", { className: "flex gap-[0.8rem]", children: [_jsxs("div", { className: "relative", children: [_jsx(Chip, { label: year, isActive: isYearFilterOpen, onClick: () => handleChipClick('YEAR') }), isYearFilterOpen &&
                                                    _jsx(Dropdown, { className: "absolute top-0", onClick: () => setIsYearFilterOpen(false), datas: yearOptions, previewData: year, setPreViewData: setYear })] }), _jsxs("div", { className: "relative", children: [_jsx(Chip, { label: month, isActive: isMonthFilterOpen, onClick: () => handleChipClick('MONTH') }), isMonthFilterOpen &&
                                                    _jsx(Dropdown, { className: "absolute top-0", onClick: () => setIsMonthFilterOpen(false), datas: monthOptions, previewData: month, setPreViewData: setMonth })] }), _jsxs("div", { className: "flex gap-[3rem]", children: [_jsx(Button, { variant: "primary_outline", size: "regular", children: "\uC601\uC218\uC99D \uCD94\uCD9C" }), _jsx(Button, { variant: "danger", size: "regular", onClick: handleReceiptDelete, disabled: deleteReceipt.isPending, children: "\uC120\uD0DD \uBAA9\uB85D \uC0AD\uC81C" })] })] }), _jsx(SearchBar, { placeholder: "\uAC80\uC0C9\uC5B4 2\uAE00\uC790 \uC774\uC0C1 \uC785\uB825", value: searchTerm, onChange: (e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    } })] }), _jsxs("div", { className: "rounded-[1rem] border border-gray-20 px-[2.7rem] pt-[1.6rem]", children: [_jsxs("table", { className: "w-full table-fixed", children: [_jsx(TableHeader, { headerData: HEADER_DATA }), _jsx("tbody", { children: filteredReceipts.map((receipt, index) => (_jsx(TableCell, Object.assign({ mode: "EDIT", isChecked: selectedReceiptIds.indexOf(receipt.receiptId) !== -1, isLastRow: index === filteredReceipts.length - 1, isSavePending: updateReceipt.isPending, onToggleChecked: handleCheckClick, onSave: (body) => updateReceipt.mutateAsync(body) }, receipt), receipt.receiptId))) })] }), _jsx("div", { className: "py-[1.6rem]", children: _jsx(PaginationCustom, { currentPage: page, totalPages: totalPages, onPageChange: (pageNumber) => setPage(pageNumber) }) })] })] })] }) }));
};
export default ReceiptCreate;
