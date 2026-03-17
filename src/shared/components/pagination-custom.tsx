import {cn} from '@libs/cn';
import { ComponentType, SVGProps } from "react";
import ArrowLeftIcon from "@assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "@assets/icons/arrow-right.svg?react";

interface PaginationButtonProps {
  isActive: boolean;
  content: number;
  onClick: () => void;
}

interface PaginationIconButtonProps {
  isDisabled: boolean;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

interface PaginationProps  {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const PaginationButton = ({isActive, content, onClick}: PaginationButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('W_SB14 w-[3rem] cursor-pointer rounded-full p-[0.7rem] text-gray-70', isActive && "bg-background text-black")}
    >
      {content}
    </button>
  )
}

const PaginationIconButton = ({isDisabled, Icon, onClick} : PaginationIconButtonProps) => {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn('cursor-pointer', isDisabled && 'text-gray-20')}>
      <Icon />
    </button>
  )
}

const PaginationCustom = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers: number[] = [];
  const maxPageButtons = 5;

  if (totalPages === 0) {
    pageNumbers.push(0);
  } else {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex-row-center gap-[0.4rem]">
      <PaginationIconButton
        isDisabled={currentPage === 1 || totalPages === 0}
        onClick={() => onPageChange(currentPage - 1)}
        Icon={ArrowLeftIcon}/>
      {pageNumbers.map((pageNumber) => (
        <PaginationButton
          key={pageNumber}
          onClick={() => totalPages > 0 && onPageChange(pageNumber)}
          isActive={pageNumber === currentPage}
          content={pageNumber}
         />
      ))}
      <PaginationIconButton
        isDisabled={currentPage === totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
        Icon={ArrowRightIcon}/>
    </div>
  );
};

export default PaginationCustom;