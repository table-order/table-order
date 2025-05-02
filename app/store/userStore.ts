import { create } from "zustand";
interface UserType {
  id: string;
}
interface UserStore {
  users: UserType[];
  setUsers: (users: UserType[]) => void;
}
export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
