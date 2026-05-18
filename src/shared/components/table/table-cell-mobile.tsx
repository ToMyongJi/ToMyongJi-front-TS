import type { Receipt } from '@apis/receipt/receipt';
import CheckBox from '@components/common/check-box';
import IconButton from '@components/common/icon-button';
import { cn } from '@libs/cn';
import { formatNumberWithCommas } from '@utils/format-number';

type TableCellMobileProps = {
  date: string;
  receiptList: Receipt[];
  type: 'VIEW' | 'EDIT';
  selectedReceiptIds?: number[];
  onToggleChecked?: (receiptId: number, checked: boolean) => void;
  onClickEdit?: (data: Receipt) => void;
};

const TableCellMobile = ({
  date,
  receiptList,
  type,
  selectedReceiptIds = [],
  onToggleChecked,
  onClickEdit
}: TableCellMobileProps) => {
  return (
    <div>
      <p className="W_R12 pt-[2rem] pl-[1rem] text-gary-80">{date}</p>
      <div>
        {receiptList.map((receipt) => {
          const isChecked = selectedReceiptIds.indexOf(receipt.receiptId) !== -1;
          return (
            <div
              key={receipt.receiptId}
              className="flex items-center justify-between gap-[1rem] px-[1rem] py-[1.2rem]"
            >
              <div className="flex-row-center min-w-0 gap-[1rem]">
                {type === 'EDIT' && onToggleChecked ? (
                  <CheckBox
                    checked={isChecked}
                    onChange={(checked) => onToggleChecked(receipt.receiptId, checked)}
                  />
                ) : null}
                <p className="W_SB14 min-w-0 whitespace-normal break-all text-gray-90">
                  {receipt.content}
                </p>
              </div>
              <div className="flex-row-center gap-[1rem]">
                <p
                  className={cn(
                    'W_SB15',
                    receipt.deposit === 0 ? 'text-success' : 'text-error',
                  )}
                >
                  {receipt.deposit === 0
                    ? '-' + formatNumberWithCommas(receipt.withdrawal)
                    : '+' + formatNumberWithCommas(receipt.deposit)}
                </p>
                {type === 'EDIT' && <IconButton iconType="edit" onClick={() => onClickEdit ? onClickEdit(receipt) : null} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableCellMobile;
