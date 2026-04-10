import ArrowLeftIcon from '@assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '@assets/icons/arrow-right.svg?react';
import { cn } from '@libs/cn';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

dayjs.locale('ko');

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export type ReceiptDatePickerPlacement = 'bottom' | 'bottom-start';

/** 트리거(날짜 필드) 기준으로 패널을 위·아래 어디에 붙일지 */
export type ReceiptDatePickerPanelSide = 'above' | 'below';

export type ReceiptDatePickerProps = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  onOpenChange?: (open: boolean) => void;
  /** dayjs 토큰 (react-datepicker의 yyyy.MM.dd 는 YYYY.MM.DD 로 넣으면 됩니다) */
  dateFormat?: string;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** 가로 정렬: 트리거 아래에서 가운데 / 왼쪽 시작 */
  placement?: ReceiptDatePickerPlacement;
  /** 세로: `above`면 필드 위에 달력(바텀시트 등에서 유용), 기본은 아래 */
  panelSide?: ReceiptDatePickerPanelSide;
  /** 트리거 버튼 오른쪽(아이콘 등). 박스 전체가 하나의 버튼이 되도록 안에 넣는 것을 권장 */
  trailing?: ReactNode;
};

function toDayjsFormat(pattern: string): string {
  return pattern.replace(/yyyy/g, 'YYYY').replace(/dd/g, 'DD');
}

function startOfDay(d: Date): dayjs.Dayjs {
  return dayjs(d).startOf('day');
}

function buildMonthGrid(month: dayjs.Dayjs): dayjs.Dayjs[] {
  const start = month.startOf('month').startOf('week');
  const end = month.endOf('month').endOf('week');
  const days: dayjs.Dayjs[] = [];
  let cursor = start;
  while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
    days.push(cursor);
    cursor = cursor.add(1, 'day');
  }
  return days;
}

function popoverWidthPx(): number {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 375;
  return Math.min(320, vw - 16);
}

const ReceiptDatePicker = ({
  selected,
  onChange,
  onOpenChange,
  dateFormat = 'YYYY.MM.DD',
  className,
  wrapperClassName,
  placeholder = '날짜 선택',
  disabled = false,
  minDate,
  maxDate,
  placement = 'bottom',
  panelSide = 'below',
  trailing,
}: ReceiptDatePickerProps) => {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [visibleMonth, setVisibleMonth] = useState(() =>
    selected ? dayjs(selected).startOf('month') : dayjs().startOf('month'),
  );

  const pattern = useMemo(() => toDayjsFormat(dateFormat), [dateFormat]);
  const minD = minDate ? startOfDay(minDate) : null;
  const maxD = maxDate ? startOfDay(maxDate) : null;

  const syncMonthFromSelected = useCallback(() => {
    setVisibleMonth((selected ? dayjs(selected) : dayjs()).startOf('month'));
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    syncMonthFromSelected();
  }, [open, syncMonthFromSelected]);

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const w = popoverWidthPx();
    let left = placement === 'bottom-start' ? rect.left : rect.left + rect.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    const top = panelSide === 'above' ? rect.top - gap : rect.bottom + gap;
    setPanelPos({ top, left });
  }, [placement, panelSide]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = triggerRef.current;
      const p = panelRef.current;
      const node = e.target as Node;
      if (t?.contains(node) || p?.contains(node)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const days = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);

  const canPrevMonth = useMemo(() => {
    if (!minD) return true;
    return visibleMonth.startOf('month').isAfter(minD.startOf('month'));
  }, [visibleMonth, minD]);

  const canNextMonth = useMemo(() => {
    if (!maxD) return true;
    return visibleMonth.endOf('month').isBefore(maxD.endOf('month'));
  }, [visibleMonth, maxD]);

  const label = selected ? dayjs(selected).format(pattern) : null;

  const isDisabledDay = (d: dayjs.Dayjs) => {
    const day = d.startOf('day');
    if (minD && day.isBefore(minD)) return true;
    if (maxD && day.isAfter(maxD)) return true;
    return false;
  };

  const handleSelectDay = (d: dayjs.Dayjs) => {
    if (isDisabledDay(d)) return;
    onChange(d.startOf('day').toDate());
    setOpen(false);
  };

  const panel = open
    ? createPortal(
        <div
          ref={panelRef}
          id={`${id}-panel`}
          role="dialog"
          aria-modal="true"
          aria-label="달력"
          className={cn(
            'fixed z-[100] w-[min(32rem,calc(100vw-1.6rem))] rounded-[1.2rem] border border-gray-20 bg-white p-[1.6rem] shadow-[0_8px_40px_rgba(80,92,162,0.18)]',
          )}
          style={{
            top: panelPos.top,
            left: panelPos.left,
            transform: panelSide === 'above' ? 'translateY(-100%)' : undefined,
          }}
        >
          <div className="mb-[1.2rem] flex items-center justify-between gap-[0.8rem]">
            <button
              type="button"
              disabled={!canPrevMonth}
              className={cn(
                'flex h-[4rem] w-[4rem] shrink-0 items-center justify-center rounded-[0.8rem] text-gray-90 transition-colors',
                canPrevMonth
                  ? 'hover:bg-gray-10 active:bg-gray-10'
                  : 'cursor-not-allowed opacity-35',
              )}
              aria-label="이전 달"
              onClick={() => setVisibleMonth((m) => m.subtract(1, 'month').startOf('month'))}
            >
              <ArrowLeftIcon className="text-current" width={20} height={20} />
            </button>
            <p className="W_SB15 min-w-0 flex-1 text-center text-black">
              {visibleMonth.format('YYYY년 M월')}
            </p>
            <button
              type="button"
              disabled={!canNextMonth}
              className={cn(
                'flex h-[4rem] w-[4rem] shrink-0 items-center justify-center rounded-[0.8rem] text-gray-90 transition-colors',
                canNextMonth
                  ? 'hover:bg-gray-10 active:bg-gray-10'
                  : 'cursor-not-allowed opacity-35',
              )}
              aria-label="다음 달"
              onClick={() => setVisibleMonth((m) => m.add(1, 'month').startOf('month'))}
            >
              <ArrowRightIcon className="text-current" width={20} height={20} />
            </button>
          </div>
          <div className="mb-[0.6rem] grid grid-cols-7 gap-y-[0.4rem]">
            {WEEKDAY_LABELS.map((w) => (
              <div
                key={w}
                className="W_SB12 flex h-[3.2rem] items-center justify-center text-gray-80"
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 justify-items-center gap-y-[0.4rem]">
            {days.map((d) => {
              const inMonth = d.month() === visibleMonth.month();
              const isSelected = selected != null && d.isSame(dayjs(selected), 'day');
              const isToday = d.isSame(dayjs(), 'day');
              const dis = isDisabledDay(d);
              return (
                <button
                  key={d.valueOf()}
                  type="button"
                  disabled={dis}
                  onClick={() => handleSelectDay(d)}
                  className={cn(
                    'W_M14 relative flex size-[4.4rem] shrink-0 items-center justify-center rounded-full transition-colors',
                    !inMonth && 'text-gray-70/50',
                    inMonth && !dis && 'text-gray-90',
                    dis && 'cursor-not-allowed opacity-35',
                    isToday &&
                      !isSelected &&
                      'relative after:absolute after:inset-[0.2rem] after:rounded-full after:border after:border-primary/50',
                    isSelected && 'bg-primary font-semibold text-white shadow-sm',
                    !isSelected && !dis && inMonth && 'hover:bg-gray-10 active:bg-gray-10',
                  )}
                >
                  {d.date()}
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className={cn('relative', wrapperClassName)}>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={cn(
          'W_R15 flex w-full min-w-0 items-center gap-[0.8rem] rounded-[inherit] bg-transparent text-start outline-none',
          !label && 'text-gray-70',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        onClick={() => {
          if (disabled) return;
          setOpen((o) => !o);
        }}
      >
        <span className="min-w-0 flex-1 truncate">{label ?? placeholder}</span>
        {trailing != null ? <span className="shrink-0">{trailing}</span> : null}
      </button>
      {panel}
    </div>
  );
};

export default ReceiptDatePicker;
