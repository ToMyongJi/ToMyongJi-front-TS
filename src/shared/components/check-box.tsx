import { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@libs/cn';
import CheckIcon from '@assets/icons/check.svg?react';

interface CheckBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** 현재 체크 여부 (controlled 상태) */
  checked?: boolean;
  /** 상태가 변경될 때 호출되는 함수 */
  onChange?: (checked: boolean) => void;
  /** React 19 방식의 ref 전달 */
  ref?: Ref<HTMLInputElement>;
}

export function CheckBox({ 
  className, 
  checked = false, 
  onChange, 
  ref,
  disabled,
  ...props 
}: CheckBoxProps) {
  return (
    <label 
      className={cn(
        'inline-flex items-center cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      {/* 실제 동작을 담당하지만 시각적으로는 숨겨진 기본 체크박스 */}
      <input
        type="checkbox"
        ref={ref}
        className="hidden"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />

      {/* 디자인이 적용된 커스텀 체크박스 모양 */}
      <div 
        className={cn(
          'flex items-center justify-center w-[2rem] h-[2rem] border-1  transition-colors', // 크기나 모서리(rounded)는 디자인 수치에 맞게 조절하세요.
          checked 
            ? 'border-primary bg-white' // 체크되었을 때 (이미지처럼 테두리 파란색, 배경 흰색)
            : 'border-gray-20 bg-white' // 체크 안되었을 때 (테두리 연한 회색)
        )}
      >
        {/* 체크 상태일 때만 보이는 V 아이콘 */}
        {checked && (
            <CheckIcon width={14} height={10} />
        )}
      </div>
    </label>
  );
}

export default CheckBox;