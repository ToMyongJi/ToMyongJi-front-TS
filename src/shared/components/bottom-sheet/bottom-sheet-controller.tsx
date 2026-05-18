import { cn } from '@libs/cn';
import type { PointerEvent } from 'react';

interface BottomSheetControllerProps {
  onClick?: () => void;
  onResizePointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerMove?: (e: PointerEvent<HTMLButtonElement>) => void;
  onResizePointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
}

const BottomSheetController = ({
  onClick,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
}: BottomSheetControllerProps) => {
  const showResizeHandle = Boolean(onResizePointerDown);

  return (
    <div className="w-full shrink-0 flex-col-center py-[2rem]">
      <button
        type="button"
        onClick={onClick}
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        aria-label={showResizeHandle ? '시트 높이 조절' : undefined}
        className={cn(
          'h-[0.5rem] w-[3rem] rounded-full bg-gray-10',
          showResizeHandle && 'cursor-ns-resize touch-none select-none',
          !showResizeHandle && onClick && 'cursor-pointer',
        )}
      />
    </div>
  );
};

export default BottomSheetController;