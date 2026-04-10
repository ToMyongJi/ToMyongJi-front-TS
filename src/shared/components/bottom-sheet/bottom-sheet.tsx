import { cn } from '@libs/cn';
import { AnimatePresence, motion } from 'framer-motion';
import type { PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useOutsideClick from '@hooks/use-outside-click';
import BottomSheetController from '@components/bottom-sheet/bottom-sheet-controller';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  gap?: string;
  /** 핸들을 위·아래로 드래그해 시트 높이를 조절 (뷰포트 높이 비율) */
  resizable?: boolean;
  /** 드래그로 줄일 수 있는 최소 높이 (vh) */
  minHeightVh?: number;
  /** 드래그로 늘릴 수 있는 최대 높이 (vh) */
  maxHeightVh?: number;
  /** 시트가 열릴 때의 초기 높이 (vh) */
  initialHeightVh?: number;
}

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  className,
  gap,
  resizable = false,
  minHeightVh = 32,
  maxHeightVh = 92,
  initialHeightVh = 55,
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [heightVh, setHeightVh] = useState(initialHeightVh);
  const resizeDraggingRef = useRef(false);
  const resizeStartYRef = useRef(0);
  const resizeStartHeightRef = useRef(0);

  useOutsideClick(sheetRef, onClose);

  useEffect(() => {
    if (isOpen && resizable) setHeightVh(initialHeightVh);
  }, [isOpen, resizable, initialHeightVh]);

  const clampHeight = useCallback(
    (vh: number) => Math.min(maxHeightVh, Math.max(minHeightVh, vh)),
    [minHeightVh, maxHeightVh],
  );

  const handleResizePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!resizable) return;
    resizeDraggingRef.current = true;
    resizeStartYRef.current = e.clientY;
    resizeStartHeightRef.current = heightVh;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!resizable || !resizeDraggingRef.current) return;
    const dy = resizeStartYRef.current - e.clientY;
    const deltaVh = (dy / window.innerHeight) * 100;
    setHeightVh(clampHeight(resizeStartHeightRef.current + deltaVh));
  };

  const handleResizePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (!resizeDraggingRef.current) return;
    resizeDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* capture already released */
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="bottom-sheet"
          className="fixed inset-0 z-[9] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={sheetRef}
            className={cn(
              'relative flex w-full flex-col rounded-tl-[3rem] rounded-tr-[3rem] bg-white shadow-bottom',
              resizable && 'min-h-0 overflow-hidden',
              gap,
              className,
            )}
            style={resizable ? { height: `${heightVh}vh` } : undefined}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <BottomSheetController
              onResizePointerDown={resizable ? handleResizePointerDown : undefined}
              onResizePointerMove={resizable ? handleResizePointerMove : undefined}
              onResizePointerUp={resizable ? handleResizePointerUp : undefined}
            />
            {resizable ? (
              <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            ) : (
              children
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

export default BottomSheet;