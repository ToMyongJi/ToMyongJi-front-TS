import ArrowDownIcon from '@assets/icons/arrow-up.svg?react';
import { cn } from '@libs/cn';
import type { HTMLAttributes, Ref } from 'react';

interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Chip({ className, label, isActive = false, ref, ...props }: ChipProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'W_M14 inline-flex h-[3.6rem] cursor-pointer items-center justify-center gap-[0.4rem] rounded-[3rem] border-1 border-gray-20 bg-white py-[0.8rem] pr-[1rem] pl-[1.4rem] hover:bg-background',
        className,
      )}
      {...props}
    >
      <span className="W_M14 text-gray-90">{label}</span>
      <span
        className={cn('flex items-center justify-center', isActive ? 'rotate-180' : 'rotate-0')}
      >
        <ArrowDownIcon width={20} height={20} className="text-gray-20" />
      </span>
    </button>
  );
}

export default Chip;
