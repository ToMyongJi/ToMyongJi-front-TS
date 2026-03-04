// src/shared/components/chip.tsx
import { HTMLAttributes, Ref,  } from 'react';
import { cn } from '@libs/cn';
import ArrowDownIcon from '@assets/icons/arrow-up.svg?react';


interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Chip({ 
    className, 
    label, 
    isActive = false, 
    ref, 
    ...props 
  }: ChipProps) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center gap-[0.4rem] rounded-[3rem] pl-[1.4rem] pr-[1rem] py-[0.8rem] h-[3.6rem] cursor-pointer W_M14 bg-white border-1 border-gray-20 hover:bg-background',
          className
        )}
        {...props}
      >
        <span className="text-gray-90 W_M14">{label}</span>
        <span 
          className={cn(
            'flex items-center justify-center',
            isActive ? 'rotate-180' : 'rotate-0'
          )}
        >
          <ArrowDownIcon width={20} height={20} />
        </span>
      </button>
    );
  }

export default Chip;