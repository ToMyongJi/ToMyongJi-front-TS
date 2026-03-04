// src/shared/components/button/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@libs/cn';

const buttonVariants = cva(
  // 공통 적용 스타일 (flex, 정렬, 둥근 모서리, 트랜지션 등)
  'inline-flex items-center justify-center rounded-[1rem] gap-[1rem] transition-colors hover:cursor-pointer disabled:bg-gray-20 disabled:text-gray-70 disable:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        outline: 'bg-background border-1 border-primary text-primary hover:bg-gray-10',
        danger: 'bg-error text-white hover:bg-error/90',
        gray: 'bg-gray-10 text-gray-80',
     },
      size: {
        sm: 'w-[8rem] h-[3.2rem] px-[1.8rem] py-[1.5rem] W_M14',
        md: 'w-[11rem] h-[4rem] px-[1.8rem] py-[1.5rem] W_SB15',
        regular: 'w-[12.2rem] h-[3.6rem] px-[1.8rem] py-[1.5rem] W_SB15',
        save: 'w-[6.6rem] h-v[4rem] px-[1.8rem] py-[1.5rem] W_M14' 
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // 필요한 커스텀 Props가 있다면 추가
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;