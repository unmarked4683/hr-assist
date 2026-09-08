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
        set({ accessToken: token });
      },
      setUser: (user) => set({ user }),
      logout: async () => {
        const response = await fetch(`/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to logout");
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
