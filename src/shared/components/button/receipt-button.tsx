// src/shared/components/button/receipt-button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '@components/button/button'; // 기존 버튼 임포트
import { cn } from '@libs/cn';
import TossIcon from '@assets/icons/toss-bank.svg?react';
import ExcelIcon from '@assets/icons/excel.svg?react';

type ReceiptType = 'toss' | 'excel';

interface ReceiptButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 어떤 영수증(거래내역)을 추가할지 결정하는 타입 */
  receiptType: ReceiptType;
  /** 버튼이 전체 너비를 차지할지 여부 */
  fullWidth?: boolean;
}

export const ReceiptButton = forwardRef<HTMLButtonElement, ReceiptButtonProps>(
  ({ className, receiptType, fullWidth, ...props }, ref) => {
    // 1. 타입에 따른 텍스트와 아이콘, 추가 클래스 설정
    const config = {
      toss: {
        text: '거래내역서 추가',
        // icon: <TossIcon width={24} height={24} />,
        icon: <TossIcon width={99} height={22} />, // 임시 아이콘 (실제 아이콘으로 교체)
      },
      excel: {
        text: 'Excel 데이터 추가',
        // icon: <ExcelIcon width={24} height={24} />,
        icon: <ExcelIcon width={17} height={16} />, // 임시 아이콘 (실제 아이콘으로 교체)
      },
    };

    const currentConfig = config[receiptType];

    return (
      <Button
        ref={ref}
        variant="primary_outline" // 이미지에 보였던 기본 테두리 버튼 스타일 지정
        size="regular"
        fullWidth={fullWidth}
        className={cn(
          // receipt-button만의 특별한 추가 스타일이 있다면 여기에 작성
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