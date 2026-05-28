import bang from '@assets/icons/bang.svg';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface MaintenanceCountdownToastProps {
  seconds: number;
  total?: number;
}

const MaintenanceCountdownToast = ({ seconds, total = 10 }: MaintenanceCountdownToastProps) => {
  const progress = (seconds / total) * 100;

  return createPortal(
    <motion.div
      className="fixed left-1/2 top-[8rem] z-[100]"
      style={{ translateX: '-50%' }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="flex min-w-[32rem] flex-col gap-[1.2rem] rounded-[1.2rem] border border-error bg-white px-[2rem] py-[1.6rem] shadow-lg">
        <div className="flex items-center gap-[1.2rem]">
          <img src={bang} alt="점검 예정" className="h-[2.4rem] w-[2.4rem] shrink-0" />
          <div className="flex flex-col gap-[0.2rem]">
            <p className="W_B15 text-black">서버 점검이 곧 시작됩니다</p>
            <p className="W_SB13 text-gray-80">
              <span className="text-error">{seconds}초</span> 후 점검 화면으로 전환됩니다.
            </p>
          </div>
        </div>
        <div className="h-[0.4rem] w-full overflow-hidden rounded-full bg-gray-10">
          <motion.div
            className="h-full rounded-full bg-error"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>,
    document.body,
  );
};

export default MaintenanceCountdownToast;