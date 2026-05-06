import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserInfo = {
  user_name: string;
  user_email: string;
};

type UserDetail = {
  userInfo: UserInfo | null;
  setUserInfo: (user: UserInfo) => void;
  clearUser: () => void;
};

export const useUserDetails = create<UserDetail>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (user) => set({ userInfo: user }),
      clearUser: () => set({ userInfo: null }),
    }),
    {
      name: "user-details",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    },
  ),
);
