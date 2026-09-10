import { UserProfile } from "@/store/useAuthStore";
import { ResponseWrapper } from "@/types/response-wrapper.types";

export class ApiService {
  static async login(email: string, password: string): Promise<UserProfile> {
    const data = await apiRequest<UserProfile>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  }

  static async logout(): Promise<void> {
    await apiRequest<void>("/api/auth/logout", {
      method: "POST",
    });
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

  const { data, ok, errors, statusCode }: ResponseWrapper<T> =
    await response.json();

  console.log("DATA", data);
  console.log("OK", ok);
  console.log("ERRORS", errors);
  console.log("STATUS CODE", statusCode);

  if (ok) {
    return data;
    // if (response.status === 204) return undefined as T;
    // const text = await response.text();
    // return text ? (JSON.parse(text) as T) : (undefined as T);
    // if (!ok) {
    //   console.error("ERRORS", errors);
    //   throw new Error(errors.join(", "));
    // }
    // return data;
  } else {
    throw new Error(errors.join(", "));
  }

  // let errorData: { message: string };
  // try {
  //   errorData = await response.json();
  // } catch {
  //   errorData = { message: `Błąd serwera: ${response.status}` };
  // }

  // const errorMessage = errorData.message || `Błąd serwera: ${response.status}`;
  // throw new Error(
  //   Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
  // );
};
