import SearchIcon from '@assets/icons/search.svg?react';
import { cn } from '@libs/cn';
import { type InputHTMLAttributes, type Ref, useState } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function SearchBar({ className, value, onChange, ref, ...props }: SearchBarProps) {
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
        'flex h-[4rem] w-[30rem] items-center justify-between rounded-[3rem] border-[1px] bg-white py-[0.8rem] pr-[1.6rem] pl-[2rem] transition-colors',
        isFocused ? 'border-primary' : 'border-gray-20',
        className,
      )}
    >
      <input
        ref={ref}
        type="text"
        value={currentValue}
        className={cn(
          'W_R14 h-full w-full bg-transparent outline-none placeholder:text-gray-70',
          hasValue ? 'text-black' : 'text-gray-70',
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
        className="flex flex-shrink-0 cursor-pointer items-center justify-center outline-none"
      >
        <SearchIcon width={20} height={20} />
      </button>
    </div>
  );
}

export default SearchBar;
