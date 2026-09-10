import { UserProfile } from "@/store/useAuthStore";

export class ApiService {
  static async login(email: string, password: string): Promise<UserProfile> {
    const data = await apiRequest<UserProfile>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  }
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(endpoint, baseUrl).toString();

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      console.error("UNKNOWN ERROR WHICH IS NOT AN INSTANCE OF ERROR", error);
      throw error;
    }
    if (!(error instanceof TypeError)) {
      console.error("UNKNOWN ERROR", error);
      throw error;
    }

    const { message } = error;
    if (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError")
    ) {
      throw new Error(
        "Brak połączenia z serwerem (backend wyłączony lub zablokowany przez sieć).",
      );
    }
    throw error;
  }

  if (response.ok) return response.json() as Promise<T>;

  let errorData: { message: string };
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: `Błąd serwera: ${response.status}` };
  }

  const errorMessage = errorData.message || `Błąd serwera: ${response.status}`;
  throw new Error(
    Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
  );
};
