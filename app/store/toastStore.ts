import { nanoid } from "nanoid";
import { create } from "zustand";

export type ToastType = "success" | "error";
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
interface ToastStore {
  toast: Toast | null;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: () => void;
}
export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  addToast: (message, type = "success") => {
    //추가후 3500ms 후 자동으로 사라짐
    const id = nanoid();

    set({ toast: { id, message, type } });

    setTimeout(() => {
      set({ toast: null });
    }, 3500);
  },
  removeToast: () => {
    //직접 삭제할수 있는 기능
    set({ toast: null });
  },
}));
