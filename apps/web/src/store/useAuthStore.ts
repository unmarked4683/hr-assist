import ms from "ms";
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
  accessToken: string | null;
  user: UserProfile | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAccessToken: (token) => {
        if (typeof window !== "undefined") {
          if (token) {
            document.cookie = `accessToken=${token}; path=/; max-age=${ms("30 days")}; SameSite=Lax`;
          } else {
            document.cookie = "accessToken=; path=/; max-age=0";
          }
        }
        set({ accessToken: token });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        if (typeof window !== "undefined") {
          document.cookie = "accessToken=; path=/; max-age=0";
        }
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.user = {
            ...state.user,
            createdAt: new Date(state.user.createdAt),
            updatedAt: new Date(state.user.updatedAt),
          };
        }
      },
    },
  ),
);
