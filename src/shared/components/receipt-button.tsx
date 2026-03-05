import { ButtonHTMLAttributes, Ref } from 'react';
import { Button } from '@components/button';
import { cn } from '@libs/cn';
import TossIcon from '@assets/icons/toss-bank.png';
import ExcelIcon from '@assets/icons/excel.svg?react';

type ReceiptType = 'toss' | 'excel';

interface ReceiptButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  receiptType: ReceiptType;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>; // ✅ ref 속성 추가
}

export function ReceiptButton({ 
  className, 
  receiptType, 
  fullWidth, 
  ref, 
  ...props 
}: ReceiptButtonProps) {
  const config = {
    toss: {
      text: '거래내역서 추가', 
      icon: <img src={TossIcon} alt="TossIcon" width={99} height={22} />, 
    },
    excel: {
      text: 'Excel 데이터 추가',
      icon: <ExcelIcon width={17} height={16} />, 
    },
  };

  const currentConfig = config[receiptType];

  return (
    <Button
      ref={ref}
      variant="primary_outline"
      size="regular"
      fullWidth={fullWidth}
      className={cn(
        'justify-center gap-[0.6rem]', 
        className
      )}
      {...props}
    >
      {currentConfig.icon}
      <span className="text-gray-90">{currentConfig.text}</span>
    </Button>
  );
}

export default ReceiptButton;