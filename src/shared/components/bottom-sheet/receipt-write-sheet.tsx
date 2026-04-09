import CalendarIcon from '@assets/icons/calendar.svg?react';
import PlusIcon from '@assets/icons/plus.svg?react';
import MinusIcon from '@assets/icons/minus.svg?react';
import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import ReceiptDatePicker from '@components/date-picker/receipt-date-picker';
import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import { useEffect, useState } from 'react';

type Receipt = {
  date: string;
  content: string;
  deposit: number;
  withdraw: number;
};

interface ReceiptWriteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  buttonLabel: string;
  data?: Receipt;
}
const ReceiptWriteSheet = ({
  isOpen,
  onClose,
  buttonLabel,
  data,
}: ReceiptWriteSheetProps) => {
  const subTitle = 'W_SB12 text-gray-90';
  const [picked, setPicked] = useState<Date | null>(() =>
    data?.date ? new Date(data.date) : null,
  );

  useEffect(() => {
    if (data?.date) setPicked(new Date(data.date));
  }, [data?.date]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="px-[2rem]">
      <div className="flex-col gap-[3rem] pb-[5.4rem]">
        <p className="W_B17 text-black">영수증 작성</p>
        <div className="flex-col gap-[3rem]">
          <div className="flex-col gap-[0.8rem]">
            <p className={subTitle}>날짜 선택</p>
            <ReceiptDatePicker
              selected={picked}
              onChange={setPicked}
              dateFormat="yyyy.MM.dd"
              placement="bottom-start"
              panelSide="above"
              wrapperClassName="flex items-stretch rounded-[1rem] border border-gray-20 bg-white p-[1rem] px-[1.4rem]"
              className="W_R15 h-full w-full flex-1"
              trailing={<CalendarIcon className="pointer-events-none text-gray-70" />}
            />
          </div>
          <div className="flex-col gap-[0.8rem]">
            <p className={subTitle}>내용</p>
            <TextField placeholder="내용을 입력해주세요" />
          </div>
          <div className="flex-col gap-[0.8rem]">
            <p className={subTitle}>금액</p>
            <div className="flex-row-between gap-[2rem]">
              <div className="flex-row-center gap-[0.7rem]">
                <PlusIcon className="text-gray-90" />
                <TextField type="price" placeholder="입금" className="w-full"/>
              </div>
              <div className="flex-row-center gap-[0.7rem]">
                <MinusIcon className="text-gray-90" />
                <TextField type="price" placeholder="출금" className="w-full" />
              </div>
            </div>
          </div>
          <Button variant="primary" fullWidth>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default ReceiptWriteSheet;
