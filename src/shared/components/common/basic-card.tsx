import type { HTMLAttributes } from 'react';
import {cn} from '@libs/cn';

interface BasicCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
const BasicCard = ({children, className} : BasicCardProps) => {
  return (
    <div className={cn('rounded-[1rem] border border-gray-20', className)}>
      {children}
    </div>
  );
};

export default BasicCard;