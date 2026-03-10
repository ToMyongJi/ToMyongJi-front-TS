import CloseIcon from '@assets/icons/cancel.svg?react';
import EditIcon from '@assets/icons/edit.svg?react';
import { Button } from '@components/common/button';
import { cn } from '@libs/cn';
import type { ButtonHTMLAttributes, Ref } from 'react';

type IconButtonType = 'edit' | 'cancel';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  iconType: IconButtonType;
  type?: 'button' | 'submit' | 'reset';
  ref?: Ref<HTMLButtonElement>;
}

export function IconButton({
  iconType,
  className,
  type = 'button',
  ref,
  ...props
}: IconButtonProps) {
  // 타입에 따른 아이콘 매핑
  const iconMap = {
    edit: <EditIcon width={16} height={16} />,
    cancel: <CloseIcon width={15} height={16} />,
  };

  return (
    <Button
      ref={ref}
      type={type}
      variant="gray_outline"
      className={cn('!p-0 h-[3rem] w-[3rem] flex-shrink-0 rounded-[0.8rem]', className)}
      {...props}
    >
      {iconMap[iconType]}
    </Button>
  );
}

export default IconButton;
