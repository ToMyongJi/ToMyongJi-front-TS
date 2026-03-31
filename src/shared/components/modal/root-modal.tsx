import {createPortal} from 'react-dom';
import {AnimatePresence, motion} from 'framer-motion';
import {useModalStore} from '@store/modal-store';
import CustomModal from '@components/modal/custom-modal';

const RootModal = () => {
  const {type, props, isSubmitting, confirm, cancel} = useModalStore();
  const isOpen = type !== null && props !== null;
  const handleBackdropClick = () => {
    if (isSubmitting) return;
    void cancel();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex-row-center px-[1.6rem]">
        <motion.button
          type="button"
          className="absolute inset-0 bg-black/30"
          onClick={handleBackdropClick}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
        />
        <motion.div
          initial={{opacity: 0, y: 16, scale: 0.98}}
          animate={{opacity: 1, y: 0, scale: 1}}
          exit={{opacity: 0, y: 8, scale: 0.98}}
          transition={{duration: 0.18}}
        >
          <CustomModal
            type={type}
            title={props.title}
            description={props.description}
            confirmText={props.confirmText}
            cancelText={props.cancelText}
            isSubmitting={isSubmitting}
            onConfirm={confirm}
            onCancel={cancel}
          />
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default RootModal;