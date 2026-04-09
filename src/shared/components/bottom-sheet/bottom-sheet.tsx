import {cn} from '@libs/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import useOutsideClick from '@hooks/use-outside-click';
import BottomSheetController from '@components/bottom-sheet/bottom-sheet-controller';
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  gap?: string;
}

const BottomSheet = ({
                       isOpen,
                       onClose,
                       children,
                       className,
                       gap,
                     }: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  useOutsideClick(sheetRef, onClose);

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="bottom-sheet"
          className="fixed inset-0 z-[99] flex items-end justify-center"
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
              gap,
              className,
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <BottomSheetController/>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

export default BottomSheet;