import { create } from "zustand";

export interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;

  isAuthorized: () => boolean;

  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  (set, get): AuthState => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),

    isAuthorized: () => !!get().accessToken,

    logout: () => set({ accessToken: null }),
  }),
);
