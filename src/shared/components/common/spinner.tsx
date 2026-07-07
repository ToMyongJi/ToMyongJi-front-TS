import { cn } from '@libs/cn';
import type { HTMLAttributes } from 'react';

type SpinnerProps = HTMLAttributes<HTMLDivElement>;

const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn(
        'h-[7.4rem] w-[7.4rem] animate-spin rounded-full border-[6px] border-primary/20 border-t-primary',
        className,
      )}
      {...props}
    />
  );
};

export default Spinner;
