import type { LoginInput, LoginResponse, Session } from "@/lib/types/auth";
import { apiClient } from "@/services/api-client";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function login(input: LoginInput): Promise<LoginResponse> {
  if (USE_MOCK) {
    if (!input.email || !input.password) {
      throw new Error("Podaj email i hasło");
    }

    return {
      session: {
        token: "mock-token",
        user: {
          id: "user-1",
          email: input.email,
          firstName: "Anna",
          lastName: "Kowalska",
        },
      },
    };
  }

  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function logout(): Promise<void> {
  if (USE_MOCK) return;
  await apiClient<void>("/auth/logout", { method: "POST" });
}

export async function getSession(): Promise<Session | null> {
  if (USE_MOCK) {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("hr-assist-session");
    return raw ? (JSON.parse(raw) as Session) : null;
  }

  return apiClient<Session | null>("/auth/session");
}

export function persistSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem("hr-assist-session");
    return;
  }
  window.localStorage.setItem("hr-assist-session", JSON.stringify(session));
}
