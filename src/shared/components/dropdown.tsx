import { cn } from '@libs/cn';
import type { HTMLAttributes, MouseEvent } from 'react';

interface DropdownProps extends HTMLAttributes<HTMLButtonElement> {
  datas: string[];
  previewData: string;
  setPreViewData: (value: string) => void;
  buttonClass?: string;
}

const Dropdown = ({
  datas,
  previewData,
  setPreViewData,
  buttonClass,
  className,
  onClick,
  ...props
}: DropdownProps) => {
  return (
    <div className={cn('flex-col overflow-hidden rounded-[4px] border border-gray-70 bg-white', className)}>
      {datas?.map((data) => (
        <button
          type="button"
          key={data}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            setPreViewData(data);
            onClick?.(event);
          }}
          className={cn('W_M14 w-[9.6rem] p-[1rem] text-start hover:bg-background', previewData === data && 'bg-background', buttonClass)}
          {...props}
        >{data}</button>
      ))}

    </div>
  );
};

export default Dropdown;