import { create } from "zustand";

export interface AuthState {
  email: string;
  setEmail: (email: string) => void;

  password: string;
  setPassword: (password: string) => void;

  accessToken: string | null;
  setAccessToken: (token: string | null) => void;

  isAuthorized: () => boolean;

  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  (set, get): AuthState => ({
    email: "",
    setEmail: (email) => set({ email }),

    password: "",
    setPassword: (password) => set({ password }),

    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),

    isAuthorized: () => !!get().accessToken,

    logout: () => set({ email: "", password: "", accessToken: null }),
  }),
);
