import { InputHTMLAttributes, Ref, useState } from 'react';
import { cn } from '@libs/cn';
import SearchIcon from '@assets/icons/search.svg?react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function SearchBar({ 
  className, 
  value, 
  onChange,
  ref, 
  ...props 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  // ✅ 추가됨: 내부적으로 사용자가 입력한 값을 추적하기 위한 state
  const [internalValue, setInternalValue] = useState(value || '');

  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = value !== undefined && value !== '' && value !== null;

  // 입력 변경 시 이벤트 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 내부 state 업데이트 (이를 통해 hasValue가 다시 계산됨)
    setInternalValue(e.target.value);
    // 외부에서 전달받은 onChange가 있다면 호출
    onChange?.(e);
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-between w-[30rem] h-[4rem] pl-[2rem] pr-[1.6rem] py-[0.8rem] rounded-[3rem] transition-colors bg-white border-[1px]',
        isFocused ? 'border-primary' : 'border-gray-20',
        className
      )}
    >
      <input
        ref={ref}
        type="text"
        value={currentValue}
        className={cn(
          'w-full h-full bg-transparent outline-none W_R14 placeholder:text-gray-70',
          hasValue ? 'text-black' : 'text-gray-70'
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
      
      <button 
        type="button" 
        className="flex-shrink-0 flex items-center justify-center cursor-pointer outline-none"
      >
        <SearchIcon width={20} height={20} />
      </button>
    </div>
  );
}

export default SearchBar;