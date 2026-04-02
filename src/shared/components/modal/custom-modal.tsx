import Button from '@components/common/button';

type CustomModalProps = {
  type: 'alert' | 'confirm';
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => Promise<void>;
};

const CustomModal = ({
  type,
  title,
  description,
  confirmText,
  cancelText,
  isSubmitting = false,
  onConfirm,
  onCancel,
}: CustomModalProps) => {


  return (
    <div className="relative z-[60] w-full min-w-[34.2rem] rounded-[1.2rem] bg-white p-[2.5rem]">
      <p className="W_B17 text-center text-black">{title}</p>
      {description ? <p className="W_R15 mt-[0.8rem] text-center text-gray-90">{description}</p> : null}

      <div className="mt-[1.8rem] flex-row-center gap-[1rem]">
        {type === 'confirm' ? (
          <Button
            variant="primary_outline"
            className="px-[3.5rem]"
            size="md"
            onClick={() => void onCancel()}
            disabled={isSubmitting}
          >
            {cancelText ?? '취소'}
          </Button>
        ) : null}
        <Button
          variant="primary"
          className="px-[3.5rem]"
          size="regular"
          onClick={() => void onConfirm()}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : (confirmText ?? '확인')}
        </Button>
      </div>
    </div>
  );
};

export default CustomModal;