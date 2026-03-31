import {useModalStore} from '@store/modal-store';

type ModalCallback = () => void | boolean | Promise<void | boolean>;

export const useModal = () => {
  const open = useModalStore((s) => s.open);

  const alert = (props: {
    title: string;
    description: string;
    confirmText?: string;
  }) => {
    return open('alert', props);
  };

  const confirm = (props: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: ModalCallback;
    onCancel?: () => void | Promise<void>;
  }) => {
    return open('confirm', {
      ...props,
      cancelText: props.cancelText ?? '취소',
      confirmText: props.confirmText ?? '확인',
    });
  };

  return { alert, confirm };
};