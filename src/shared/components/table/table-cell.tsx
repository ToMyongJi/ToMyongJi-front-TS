import { cn } from '@libs/cn';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

import CheckBox from '@components/common/check-box';
import Button from '@components/common/button';
import IconButton from '@components/common/icon-button';
import TextField from '@components/common/textfield';

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
  onToggleChecked?: (receiptId: number, checked: boolean) => void;
};

type EditableFields = {
  date: string;
  content: string;
  deposit: string;
  withdrawal: string;
};

const formatAmount = (value: number) =>
  (value ?? 0).toLocaleString('ko-KR');

const TableCell = ({
  receiptId,
  mode,
  date,
  content,
  deposit,
  withdrawal,
  isLastRow = false,
  isChecked = false,
  onToggleChecked,
}: TableCellProps) => {
  const isEditMode = mode === 'EDIT';
  const tdStyle = 'W_M15 text-gray-90 text-center px-[0.3rem] py-[1rem]';
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<EditableFields>({
    date,
    content,
    deposit: String(deposit ?? 0),
    withdrawal: String(withdrawal ?? 0),
  });

  const currentFields: EditableFields = {
    date,
    content,
    deposit: String(deposit ?? 0),
    withdrawal: String(withdrawal ?? 0),
  };

  useEffect(() => {
    if (isEditing) return;

    setEditedFields(currentFields);
  }, [date, content, deposit, withdrawal, isEditing]);

  const handleFieldChange = (field: keyof EditableFields) => (e: ChangeEvent<HTMLInputElement>) => {
    setEditedFields((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedFields(currentFields);
      setIsEditing(false);
      return;
    }
    setIsEditing(true);
  };

  const parsedDeposit = Number(editedFields.deposit.replaceAll(',', '')) || 0;
  const parsedWithdrawal = Number(editedFields.withdrawal.replaceAll(',', '')) || 0;

  const renderCellContent = (
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    textFieldType: 'default' | 'price' = 'default',
  ) => {
    if (!(isEditMode && isEditing)) return value;

    return (
      <TextField
        type={textFieldType}
        value={value}
        onChange={onChange}
        className={cn('w-full', textFieldType === 'price' && 'text-black')}
      />
    );
  };

  return (
    <tbody>
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
      <td className={tdStyle}>{renderCellContent(editedFields.date, handleFieldChange('date'))}</td>
      <td className={cn(tdStyle, 'text-start')}>{renderCellContent(editedFields.content, handleFieldChange('content'))}</td>
      <td className={cn(tdStyle, "text-success")}>
        {isEditMode && isEditing
          ? renderCellContent(editedFields.deposit, handleFieldChange('deposit'), 'price')
          : formatAmount(parsedDeposit)}
      </td>
      <td className={cn(tdStyle, "text-error-deep")}>
        {isEditMode && isEditing
          ? renderCellContent(editedFields.withdrawal, handleFieldChange('withdrawal'), 'price')
          : formatAmount(parsedWithdrawal)}
      </td>
      {isEditMode && (
        <td className="text-center">
          {!isEditing ? <IconButton iconType={'edit'} onClick={handleEditToggle} /> : <Button variant="primary" size="save" className="px-[0.8rem]">저장하기</Button>}
        </td>
      )}
    </tr>

    </tbody>
  );
};

export default TableCell;