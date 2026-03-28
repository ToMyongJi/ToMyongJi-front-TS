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
import { cn } from '@libs/cn';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CheckBox from '@components/common/check-box';
import Button from '@components/common/button';
import IconButton from '@components/common/icon-button';
import TextField from '@components/common/textfield';
const TD_BASE = 'W_M15 text-gray-90 text-center px-[0.3rem] py-[1rem]';
const DATE_PICKER_WRAP = 'mx-auto flex h-[4rem] max-w-[11.2rem] items-center rounded-[0.8rem] border border-gray-20 bg-white px-[1rem] py-[0.6rem] transition-colors focus-within:border-primary';
const formatAmount = (value) => (value !== null && value !== void 0 ? value : 0).toLocaleString('ko-KR');
const toEditableFields = (content, deposit, withdrawal) => ({
    content,
    deposit: String(deposit !== null && deposit !== void 0 ? deposit : 0),
    withdrawal: String(withdrawal !== null && withdrawal !== void 0 ? withdrawal : 0),
});
const parseReceiptDate = (raw) => {
    const d = dayjs(raw.trim());
    return d.isValid() ? d.toDate() : null;
};
const parseAmountInput = (raw) => Number(raw.replace(/,/g, '')) || 0;
function isSameDayAsProp(editedDate, dateProp) {
    return (dayjs(editedDate).isValid() &&
        dayjs(dateProp).isValid() &&
        dayjs(editedDate).isSame(dayjs(dateProp), 'day'));
}
function isDraftUnchanged(editedDate, dateProp, contentProp, depositProp, withdrawalProp, draft) {
    if (!isSameDayAsProp(editedDate, dateProp))
        return false;
    const depositNum = parseAmountInput(draft.deposit);
    const withdrawalNum = parseAmountInput(draft.withdrawal);
    return (draft.content.trim() === (contentProp !== null && contentProp !== void 0 ? contentProp : '').trim() &&
        depositNum === (depositProp !== null && depositProp !== void 0 ? depositProp : 0) &&
        withdrawalNum === (withdrawalProp !== null && withdrawalProp !== void 0 ? withdrawalProp : 0));
}
function EditableText({ active, value, onChange, fieldType = 'default', }) {
    if (!active)
        return value;
    return (_jsx(TextField, { type: fieldType, value: value, onChange: onChange, className: cn('w-full', fieldType === 'price' && 'text-black') }));
}
const TableCell = ({ receiptId, mode, date, content, deposit, withdrawal, isLastRow = false, isChecked = false, isSavePending = false, onToggleChecked, onSave, }) => {
    const isEditMode = mode === 'EDIT';
    const [isEditing, setIsEditing] = useState(false);
    const [editedDate, setEditedDate] = useState(() => parseReceiptDate(date));
    const [editedFields, setEditedFields] = useState(() => toEditableFields(content, deposit, withdrawal));
    useEffect(() => {
        if (isEditing)
            return;
        setEditedDate(parseReceiptDate(date));
        setEditedFields(toEditableFields(content, deposit, withdrawal));
    }, [date, content, deposit, withdrawal, isEditing]);
    const handleFieldChange = (field) => (e) => {
        setEditedFields((prev) => (Object.assign(Object.assign({}, prev), { [field]: e.target.value })));
    };
    const resetDraftFromProps = () => {
        setEditedDate(parseReceiptDate(date));
        setEditedFields(toEditableFields(content, deposit, withdrawal));
    };
    const handleEditToggle = () => {
        if (isEditing) {
            resetDraftFromProps();
            setIsEditing(false);
            return;
        }
        resetDraftFromProps();
        setIsEditing(true);
    };
    const parsedDeposit = parseAmountInput(editedFields.deposit);
    const parsedWithdrawal = parseAmountInput(editedFields.withdrawal);
    const showInputs = isEditMode && isEditing;
    const handleSave = () => __awaiter(void 0, void 0, void 0, function* () {
        if (editedDate == null) {
            alert('날짜를 선택해 주세요.');
            return;
        }
        if (isDraftUnchanged(editedDate, date, content, deposit, withdrawal, editedFields)) {
            setIsEditing(false);
            return;
        }
        if (receiptId == null || onSave == null) {
            setIsEditing(false);
            return;
        }
        try {
            yield onSave({
                receiptId,
                date: editedDate.toISOString(),
                content: editedFields.content.trim(),
                deposit: parsedDeposit,
                withdrawal: parsedWithdrawal,
            });
            setIsEditing(false);
        }
        catch (_a) {
            return;
        }
    });
    return (_jsxs("tr", { className: cn('border-gray-10', !isLastRow && 'border-b-1', isChecked && 'bg-gray-10'), children: [isEditMode && (_jsx("td", { className: "py-[1rem] text-center", children: _jsx(CheckBox, { checked: isChecked, onChange: (checked) => {
                        if (receiptId == null)
                            return;
                        onToggleChecked === null || onToggleChecked === void 0 ? void 0 : onToggleChecked(receiptId, checked);
                    } }) })), _jsx("td", { className: TD_BASE, children: showInputs ? (_jsx("div", { className: DATE_PICKER_WRAP, children: _jsx(DatePicker, { selected: editedDate, onChange: (next) => setEditedDate(next), dateFormat: "yyyy.MM.dd", popperPlacement: "bottom-start", popperClassName: "receipt-datepicker-popper", calendarClassName: "receipt-datepicker-calendar", className: "W_R15 w-full min-w-0 bg-transparent text-center outline-none placeholder:text-gray-70" }) })) : (date) }), _jsx("td", { className: cn(TD_BASE, 'text-start'), children: _jsx(EditableText, { active: showInputs, value: editedFields.content, onChange: handleFieldChange('content') }) }), _jsx("td", { className: cn(TD_BASE, 'text-success'), children: showInputs ? (_jsx(EditableText, { active: true, value: editedFields.deposit, onChange: handleFieldChange('deposit'), fieldType: "price" })) : (formatAmount(parsedDeposit)) }), _jsx("td", { className: cn(TD_BASE, 'text-error-deep'), children: showInputs ? (_jsx(EditableText, { active: true, value: editedFields.withdrawal, onChange: handleFieldChange('withdrawal'), fieldType: "price" })) : (formatAmount(parsedWithdrawal)) }), isEditMode && (_jsx("td", { className: "text-center", children: !isEditing ? (_jsx(IconButton, { iconType: "edit", onClick: handleEditToggle })) : (_jsx(Button, { variant: "primary", size: "save", className: "px-[0.8rem]", disabled: isSavePending, onClick: () => void handleSave(), children: "\uC800\uC7A5\uD558\uAE30" })) }))] }));
};
export default TableCell;
