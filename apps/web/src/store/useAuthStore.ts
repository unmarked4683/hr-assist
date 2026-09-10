import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthorized: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      setUser: (user) => set({ user }),
      isAuthorized: () => !!get().user,
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          const { createdAt, updatedAt, ...user } = state.user;
          state.user = {
            ...user,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          };
        }
      },
    },
  ),
);
