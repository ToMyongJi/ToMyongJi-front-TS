import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import ArrowRightIcon from "@assets/icons/arrow-right.svg?react";
import DocumentIcon from "@assets/icons/document.svg?react";
import ExcelIcon from "@assets/icons/excel.svg?react";
import TossBankImg from "@assets/icons/toss-bank.png";
import type { ReactNode } from "react";
import {useNavigate} from 'react-router-dom';


interface ReceiptCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onClickEdit: () => void;
}

function LongButton({ icon, label, onClick }: { icon: ReactNode; label: string, onClick?: () => void }) {
  return (
      <button type="button" className="w-full flex-row-between cursor-pointer gap-[0.6rem] rounded-[1rem] border border-gray-20 p-[1.6rem]" onClick={onClick}>
        <div className="flex-items-center gap-[1rem]">
          {icon}
          <p className="W_SB14 text-gray-90">{label}</p>
        </div>
        <ArrowRightIcon className={"text-gray-90"}/>
      </button>
  );
}

const ReceiptCreateSheet = ({isOpen, onClose, onClickEdit}: ReceiptCreateSheetProps) => {
  const navigate = useNavigate();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="px-[3rem]">
      <div className="flex-col-center gap-[0.8rem] pb-[5.4rem]">
        <LongButton icon={<DocumentIcon className="text-gray-90"/>} label={"영수증 작성(수기)"} onClick={onClickEdit}/>
        <LongButton icon={<img src={TossBankImg} alt="토스뱅크 이미지" className="w-[9.5rem]"/>} label={"거래내역서 추가"} onClick={() => navigate('/tossbank-create')}/>
        <LongButton icon={<ExcelIcon/>} label={"Excel 데이터 추가"} onClick={() => navigate('/csv-create')}/>
      </div>
    </BottomSheet>
  );
};

export default ReceiptCreateSheet;