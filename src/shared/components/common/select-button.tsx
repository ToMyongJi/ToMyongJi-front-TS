import ArrowDownIcon from '@assets/icons/arrow-down.svg?react';
import { cn } from '@libs/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, Ref } from 'react';

const selectButtonVariants = cva(
  'W_M15 flex h-[4rem] w-[30rem] cursor-pointer items-center justify-between rounded-[1rem] py-[0.8rem] pr-[1rem] pl-[1.4rem] outline-none transition-colors',
  {
    variants: {
      status: {
        // 1) 기본 상태
        default:
          'border-1 border-gray-20 bg-white text-gray-70 hover:bg-gray-50 active:bg-background active:text-black',
        // 2) 열림 상태 (드롭다운 펼침)
        selecting: 'border-1 border-primary bg-white text-gray-70',
        // 3) 선택 완료 상태
        filled: 'border-1 border-primary bg-white text-black hover:bg-gray-50 active:bg-background',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  },
);

interface SelectButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'>,
    VariantProps<typeof selectButtonVariants> {
  value?: string;
  placeholder?: string;
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
  // 우선순위: isOpen > value > default
  const currentStatus = status || (isOpen ? 'selecting' : value ? 'filled' : 'default');

  return (
    <button
      ref={ref}
      type="button"
      className={cn(selectButtonVariants({ status: currentStatus, className }))}
      {...props}
    >
      <span>{value || placeholder}</span>
      <span className={cn('text-gray-20 transition-transform', isOpen && 'rotate-180')}>
        <ArrowDownIcon width={20} height={20} />
      </span>
    </button>
  );
}

export default SelectButton;
