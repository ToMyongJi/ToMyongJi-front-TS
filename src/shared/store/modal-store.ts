import {create} from 'zustand';

type ModalType = 'alert' | 'confirm';

type ModalOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | boolean | Promise<void | boolean>;
  onCancel?: () => void | Promise<void>;
};

interface ModalState {
  type: ModalType | null;
  props: ModalOptions | null;
  isSubmitting: boolean;
  resolver?: (value: boolean) => void;
  open: (type: ModalType, props?: ModalOptions) => Promise<boolean>;
  close: () => void;
  confirm: () => Promise<void>;
  cancel: () => Promise<void>;
}

export const useModalStore = create<ModalState>((set, get) => ({
  type: null,
  props: null,
  isSubmitting: false,

  open: (type, props) => {
    return new Promise<boolean>((resolve) => {
      get().resolver?.(false);
      set({
        type,
        props: props ?? null,
        isSubmitting: false,
        resolver: resolve,
      });
    });
  },

  close: () =>
    set({
      type: null,
      props: null,
      isSubmitting: false,
      resolver: undefined,
    }),

  confirm: async () => {
    const {type, props, resolver, close} = get();
    if (!props || !type) return;

    if (type === 'alert') {
      resolver?.(true);
      close();
      return;
    }

    set({isSubmitting: true});
    try {
      const result = await props.onConfirm?.();
      if (result === false) return;

      resolver?.(true);
      close();
    } catch {
      // Keep the modal open when async confirm action fails.
    } finally {
      if (get().type !== null) {
        set({isSubmitting: false});
      }
    }
  },

  cancel: async () => {
    const {props, resolver, close, isSubmitting} = get();
    if (!props) return;
    if (isSubmitting) return;

    try {
      await props.onCancel?.();
    } finally {
      resolver?.(false);
      close();
    }
  },
}));