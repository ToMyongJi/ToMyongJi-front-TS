import CalendarIcon from '@assets/icons/calendar.svg?react';
import PlusIcon from '@assets/icons/plus.svg?react';
import MinusIcon from '@assets/icons/minus.svg?react';
import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import ReceiptDatePicker from '@components/date-picker/receipt-date-picker';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useModalStore } from '@store/modal-store';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type ReceiptForm = {
  date: Date | null;
  content: string;
  deposit: string;
  withdrawal: string;
};

interface ReceiptWriteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  buttonLabel: string;
  data: ReceiptForm;
  setData: Dispatch<SetStateAction<ReceiptForm>>;
  onSubmit: () => void;
  isPending?: boolean;
}

const ReceiptWriteSheet = ({
  isOpen,
  onClose,
  buttonLabel,
  data,
  setData,
  onSubmit,
  isPending = false,
}: ReceiptWriteSheetProps) => {
  const subTitle = 'W_SB12 text-gray-90';
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const isModalOpen = useModalStore((state) => state.type !== null);

  const handleSheetClose = () => {
    if (isDatePickerOpen || isModalOpen) return;
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleSheetClose} className="px-[2rem]">
      <div className="flex-col gap-[3rem] pb-[5.4rem]">
        <p className="W_B17 text-black">영수증 작성</p>
        <div className="flex-col gap-[3rem]">
          <div className="flex-col gap-[0.8rem]">
            <p className={subTitle}>날짜 선택</p>
            <ReceiptDatePicker
              selected={data.date}
              onChange={(date) => {
                setData((prev) => ({ ...prev, date }));
              }}
              onOpenChange={setIsDatePickerOpen}
              dateFormat="yyyy.MM.dd"
              placement="bottom-start"
              panelSide="below"
              wrapperClassName="flex items-stretch rounded-[1rem] border border-gray-20 bg-white p-[1rem] px-[1.4rem]"
              className="W_R15 h-full w-full flex-1"
              trailing={<CalendarIcon className="pointer-events-none text-gray-70" />}
            />
          </div>
          <div className="flex-col gap-[0.8rem]">
            <p className={subTitle}>내용</p>
            <TextField
              placeholder="내용을 입력해주세요"
              value={data.content}
              onChange={(e) => setData((prev) => ({ ...prev, content: e.target.value }))}
            />
          </div>
          <div className="flex-col gap-[0.8rem]">
            <p className={subTitle}>금액</p>
            <div className="flex-row-between gap-[2rem]">
              <div className="flex-row-center gap-[0.7rem]">
                <PlusIcon className="text-gray-90" />
                <TextField
                  type="price"
                  placeholder="입금"
                  className="w-full"
                  value={data.deposit}
                  onChange={(e) => setData((prev) => ({ ...prev, deposit: e.target.value }))}
                />
              </div>
              <div className="flex-row-center gap-[0.7rem]">
                <MinusIcon className="text-gray-90" />
                <TextField
                  type="price"
                  placeholder="출금"
                  className="w-full"
                  value={data.withdrawal}
                  onChange={(e) => setData((prev) => ({ ...prev, withdrawal: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <Button variant="primary" fullWidth disabled={isPending} onClick={onSubmit}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default ReceiptWriteSheet;
