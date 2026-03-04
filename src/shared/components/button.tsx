import { ButtonHTMLAttributes, Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@libs/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[1rem] gap-[1rem] transition-colors hover:cursor-pointer disabled:bg-gray-20 disabled:text-gray-70 disable:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 disabled:text-white active:bg-primary-deep',
        primary_outline: 'bg-white border-1 border-primary text-primary disabled:border-none active:bg-background',
        danger: 'bg-error text-white hover:bg-error/90 disabled:text-white active:bg-error-deep',
        gray: 'bg-gray-10 text-gray-80 disabled:text-gray-80',
        gray_outline: 'bg-white text-black border-1 border-gray-20 disabled:bg-background text-black active:bg-background',
      },
      size: {
        sm: 'h-[3.2rem] px-[1.8rem] py-[1.5rem] W_M14',
        md: 'h-[4rem] px-[1.8rem] py-[1.5rem] W_SB15',
        regular: 'h-[3.6rem] px-[1.8rem] py-[1.5rem] W_SB15',
        save: 'h-[4rem] px-[1.8rem] py-[1.5rem] W_M14',
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
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ 
  className, 
  variant, 
  size, 
  fullWidth, 
  ref, 
  ...props 
}: ButtonProps) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  );
}

export default Button;