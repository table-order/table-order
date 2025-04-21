import { create } from "zustand";

interface NavState {
  isFixed: boolean;
  setIsFixed: (isFixed: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  isFixed: false,
  setIsFixed: (isFixed) => set({ isFixed }),
}));
