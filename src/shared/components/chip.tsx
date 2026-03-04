// src/shared/components/chip.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@libs/cn';
import ArrowDownIcon from '@assets/icons/arrow-up.svg?react';

// 필요 시 프로젝트의 화살표 SVG 아이콘 경로로 변경하세요.
// import ChevronIcon from '@assets/icons/chevron-down.svg?react';

interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  /** 칩에 표시될 텍스트 */
  label: string;
  /** 현재 칩이 선택(활성화)된 상태인지 여부 */
  isActive?: boolean;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, label, isActive = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        // 칩의 기본 스타일 (알약 모양: rounded-full)
        // 높이는 이미지 기준 36px 이므로 h-[3.6rem]
        className={cn(
          'inline-flex items-center justify-center gap-[0.4rem] rounded-[3rem] pl-[1.4rem] pr-[1rem] py-[0.8rem] h-[3.6rem] cursor-pointer W_M14 bg-white border-1 border-gray-20 hover:bg-background',
     
        //   isActive 
            // ? 'bg-background text-gray-90 border-1 border-gray-20' // 클릭(활성) 시 배경색
            // : 'bg-white text-gray-90 border-1 border-gray-20 ', // 기본 상태 (테두리 있음)
          className
        )}
        {...props}
      >
        <span className="text-gray-90 W_M14">{label}</span>
        
        {/* 화살표 아이콘 영역 */}
        {/* isActive가 true일 때 rotate-180을 주어 반대로 뒤집습니다 (기본이 화살표 아래(down)인 아이콘을 기준) */}
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
);

Chip.displayName = 'Chip';
export default Chip;