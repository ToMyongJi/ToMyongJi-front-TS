// src/shared/components/button/receipt-button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '@components/button'; // 기존 버튼 임포트
import { cn } from '@libs/cn';
import TossIcon from '@assets/icons/toss-bank.svg?react';
import ExcelIcon from '@assets/icons/excel.svg?react';

type ReceiptType = 'toss' | 'excel';

interface ReceiptButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  receiptType: ReceiptType;
  fullWidth?: boolean;
}

export const ReceiptButton = forwardRef<HTMLButtonElement, ReceiptButtonProps>(
  ({ className, receiptType, fullWidth, ...props }, ref) => {
    const config = {
      toss: {
        text: '거래내역서 추가',
        icon: <TossIcon width={99} height={22} />, 
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
);

ReceiptButton.displayName = 'ReceiptButton';
export default ReceiptButton;