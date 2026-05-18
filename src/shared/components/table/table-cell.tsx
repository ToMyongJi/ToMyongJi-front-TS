import type { UpdateReceiptRequest } from '@apis/receipt/receipt';
import Button from '@components/common/button';
import CheckBox from '@components/common/check-box';
import IconButton from '@components/common/icon-button';
import TextField from '@components/common/textfield';
import ReceiptDatePicker from '@components/date-picker/receipt-date-picker';
import { cn } from '@libs/cn';
import dayjs from 'dayjs';
import type { ChangeEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';

type TableRowMode = 'VIEW' | 'EDIT';

type TableCellProps = {
  mode: TableRowMode;
  receiptId?: number;
  date: string;
  content: string;
  deposit: number;
  withdrawal: number;
  isLastRow?: boolean;
  isChecked?: boolean;
  isSavePending?: boolean;
  onToggleChecked?: (receiptId: number, checked: boolean) => void;
  onSave?: (payload: UpdateReceiptRequest) => Promise<unknown>;
};

type EditableFields = {
  content: string;
  deposit: string;
  withdrawal: string;
};

const TD_BASE = 'W_M15 text-gray-90 text-center px-[0.3rem] py-[1rem]';
const DATE_PICKER_WRAP =
  'mx-auto flex h-[4rem] max-w-[11.2rem] items-center rounded-[0.8rem] border border-gray-20 bg-white px-[1rem] py-[0.6rem] transition-colors focus-within:border-primary';

const formatAmount = (value: number) => (value ?? 0).toLocaleString('ko-KR');

const toEditableFields = (
  content: string,
  deposit: number,
  withdrawal: number,
): EditableFields => ({
  content,
  deposit: String(deposit ?? 0),
  withdrawal: String(withdrawal ?? 0),
});

const parseReceiptDate = (raw: string): Date | null => {
  const d = dayjs(raw.trim());
  return d.isValid() ? d.toDate() : null;
};

const parseAmountInput = (raw: string) => Number(raw.replace(/,/g, '')) || 0;

function isSameDayAsProp(editedDate: Date, dateProp: string) {
  return (
    dayjs(editedDate).isValid() &&
    dayjs(dateProp).isValid() &&
    dayjs(editedDate).isSame(dayjs(dateProp), 'day')
  );
}

function isDraftUnchanged(
  editedDate: Date,
  dateProp: string,
  contentProp: string,
  depositProp: number,
  withdrawalProp: number,
  draft: EditableFields,
) {
  if (!isSameDayAsProp(editedDate, dateProp)) return false;
  const depositNum = parseAmountInput(draft.deposit);
  const withdrawalNum = parseAmountInput(draft.withdrawal);
  return (
    draft.content.trim() === (contentProp ?? '').trim() &&
    depositNum === (depositProp ?? 0) &&
    withdrawalNum === (withdrawalProp ?? 0)
  );
}

function EditableText({
  active,
  value,
  onChange,
  fieldType = 'default',
}: {
  active: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fieldType?: 'default' | 'price';
}): ReactNode {
  if (!active) return value;
  return (
    <TextField
      type={fieldType}
      value={value}
      onChange={onChange}
      className={cn('w-full', fieldType === 'price' && 'text-black')}
    />
  );
}

const TableCell = ({
  receiptId,
  mode,
  date,
  content,
  deposit,
  withdrawal,
  isLastRow = false,
  isChecked = false,
  isSavePending = false,
  onToggleChecked,
  onSave,
}: TableCellProps) => {
  const isEditMode = mode === 'EDIT';
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState<Date | null>(() => parseReceiptDate(date));
  const [editedFields, setEditedFields] = useState<EditableFields>(() =>
    toEditableFields(content, deposit, withdrawal),
  );

  useEffect(() => {
    if (isEditing) return;
    setEditedDate(parseReceiptDate(date));
    setEditedFields(toEditableFields(content, deposit, withdrawal));
  }, [date, content, deposit, withdrawal, isEditing]);

  const handleFieldChange = (field: keyof EditableFields) => (e: ChangeEvent<HTMLInputElement>) => {
    setEditedFields((prev) => ({ ...prev, [field]: e.target.value }));
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

  const handleSave = async () => {
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
      await onSave({
        receiptId,
        date: dayjs(editedDate).format('YYYY-MM-DD'),
        content: editedFields.content.trim(),
        deposit: parsedDeposit,
        withdrawal: parsedWithdrawal,
      });
      setIsEditing(false);
    } catch {
      return;
    }
  };

  return (
    <tr className={cn('border-gray-10', !isLastRow && 'border-b-1', isChecked && 'bg-gray-10')}>
      {isEditMode && (
        <td className="py-[1rem] text-center">
          <CheckBox
            checked={isChecked}
            onChange={(checked) => {
              if (receiptId == null) return;
              onToggleChecked?.(receiptId, checked);
            }}
          />
        </td>
      )}
      <td className={TD_BASE}>
        {showInputs ? (
          <div className={DATE_PICKER_WRAP}>
            <ReceiptDatePicker
              selected={editedDate}
              onChange={(next) => setEditedDate(next)}
              dateFormat="yyyy.MM.dd"
              placement="bottom-start"
              className="W_R15 w-full min-w-0 bg-transparent text-center outline-none"
            />
          </div>
        ) : (
          date
        )}
      </td>
      <td className={cn(TD_BASE, 'whitespace-normal break-all text-start')}>
        <EditableText
          active={showInputs}
          value={editedFields.content}
          onChange={handleFieldChange('content')}
        />
      </td>
      <td className={cn(TD_BASE, 'text-success')}>
        {showInputs ? (
          <EditableText
            active
            value={editedFields.deposit}
            onChange={handleFieldChange('deposit')}
            fieldType="price"
          />
        ) : (
          formatAmount(parsedDeposit)
        )}
      </td>
      <td className={cn(TD_BASE, 'text-error-deep')}>
        {showInputs ? (
          <EditableText
            active
            value={editedFields.withdrawal}
            onChange={handleFieldChange('withdrawal')}
            fieldType="price"
          />
        ) : (
          formatAmount(parsedWithdrawal)
        )}
      </td>
      {isEditMode && (
        <td className="text-center">
          {!isEditing ? (
            <IconButton iconType="edit" onClick={handleEditToggle} />
          ) : (
            <Button
              variant="primary"
              size="save"
              className="px-[0.8rem]"
              disabled={isSavePending}
              onClick={() => void handleSave()}
            >
              저장
            </Button>
          )}
        </td>
      )}
    </tr>
  );
};

export default TableCell;
