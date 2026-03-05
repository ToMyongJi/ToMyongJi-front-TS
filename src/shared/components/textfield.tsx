import { InputHTMLAttributes, Ref, useState } from 'react';
import { cn } from '@libs/cn';

// default: 일반 텍스트 필드, price: 오른쪽에 '원'이 고정으로 붙는 필드
type TextFieldType = 'default' | 'price';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 텍스트 필드의 종류 (default: 일반, price: 가격 입력) */
  type?: TextFieldType;
  /** 에러 상태 여부 (true일 경우 빨간색 테두리 표시) */
  isError?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  className,
  value,
  type = 'default',
  isError = false,
  disabled = false,
  onChange,
  ref,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const [internalValue, setInternalValue] = useState(value || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div
      className={cn(
        // 컨테이너 공통 스타일
        'flex items-center h-[4rem] px-[1.4rem] py-[0.8rem] rounded-[0.8rem] transition-colors border-[1px] active:border-primary',
        // 배경색 분기: disabled면 회색, 아니면 흰색
        disabled ? 'bg-background border-none' : 'bg-white border-gray-10',
        type === 'price' ? 'w-[14.6rem]' : '',
        // 테두리 분기 로직
        !disabled && (
          isError 
            ? 'border-error' 
            : isFocused 
              ? 'border-primary' 
              : 'border-gray-20'
        ),
        className
      )}
    >
      <input
        ref={ref}
        type='text'
        value={currentValue}
        disabled={disabled}
        className={cn(
          'w-full h-full bg-transparent outline-none W_R15 placeholder:text-gray-70',
          disabled && 'text-black'
        )}
        onFocus={() => {
          setIsFocused(true);
      
        }}
        onBlur={() => {
          setIsFocused(false);
     
        }}
        onChange={handleChange}
        {...props}
      />

      {/* 타입이 'price'일 때만 무조건 '원'을 우측에 렌더링 */}
      {type === 'price' && (
        <span 
          className={cn(
            'flex-shrink-0 ml-[0.8rem] W_B15 select-none text-black',
          )}
        >
          원
        </span>
      )}
    </div>
  );
}

export default TextField;