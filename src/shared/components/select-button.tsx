import { ButtonHTMLAttributes, Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@libs/cn';
import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';

const selectButtonVariants = cva(
  'flex items-center justify-between w-[30rem] h-[4rem] pl-[1.4rem] pr-[1rem] py-[0.8rem] rounded-[1rem] transition-colors cursor-pointer W_M15 outline-none',
  {
    variants: {
      status: {
        // 1. Default: 아무것도 선택하지 않은 기본 상태 (흰색 배경)
        default: 'bg-white text-gray-90 border-1 border-gray-20 hover:bg-gray-50 active:bg-background',
        // 2. Pressed: 클릭(드롭다운이 열려있는) 상태
        pressed: 'bg-background text-black border-1 border-gray-20',
        // 3. Filled: 값을 선택 완료한 상태 (흰색 배경, 파란색 테두리, 진한 글씨)
        filled: 'bg-white text-black border-1 border-primary hover:bg-gray-50 active:bg-background',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);

interface SelectButtonProps 
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'>, 
    VariantProps<typeof selectButtonVariants> {
  /** 버튼에 표시될 텍스트 (예: "대학을 선택해주세요" 또는 "선택 완료된 값") */
  value?: string;
  /** 값이 없을 때 보여줄 기본 텍스트 (placeholder) */
  placeholder?: string;
  /** 드롭다운이 열려있는지 여부 (화살표 방향 및 pressed 상태를 결정) */
  isOpen?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function SelectButton({ 
  className, 
  status, 
  value,
  placeholder = '선택해주세요',
  isOpen = false,
  ref, 
  ...props 
}: SelectButtonProps) {
  
  // 상태 자동 계산: 
  // props로 status를 명시적으로 넘기지 않은 경우,
  // 1. isOpen이 true면 'pressed' 상태
  // 2. isOpen은 false인데 value가 있으면 'filled' 상태
  // 3. 둘 다 아니면 'default' 상태
  const currentStatus = status || (isOpen ? 'pressed' : (value ? 'filled' : 'default'));

  return (
    <button
      ref={ref}
      type="button"
      className={cn(selectButtonVariants({ status: currentStatus, className }))}
      {...props}
    >
      {/* 텍스트 영역: 값이 있으면 value, 없으면 placeholder 표시 */}
      <span>{value || placeholder}</span>
      
      {/* 화살표 아이콘 영역 */}
      <span 
        className={cn(
          'text-gray-20', 
          isOpen && 'rotate-180' 
        )}
      >
        <ArrowDownIcon width={20} height={20} />
      </span>
    </button>
  );
}

export default SelectButton;