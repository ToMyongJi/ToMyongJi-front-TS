import {cn} from '@libs/cn';
import { formatNumberWithCommas } from '@utils/format-number';


type receipt = {
  content: string;
  deposit: number;
  withdrawal: number;
}

interface TableCellMobileProps  {
  date: string;
  receiptList: receipt[];
}


const TableCellMobile = ({date, receiptList}: TableCellMobileProps) => {
  return (
    <div>
      <p className="W_R12 pt-[2rem] pl-[1rem] text-gary-80">{date}</p>
      <div>
        {receiptList.map((receipt) => (
          <div key={receipt.content} className="flex items-center justify-between gap-[1rem] px-[1rem] py-[1.2rem]">
            <p className="W_SB14 text-gray-90">{receipt.content}</p>
            <p className={cn("W_SB15", receipt.deposit === 0 ? "text-success" : "text-error")}>{receipt.deposit === 0 ? "-" + formatNumberWithCommas(receipt.withdrawal) : "+" + formatNumberWithCommas(receipt.deposit)}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TableCellMobile;