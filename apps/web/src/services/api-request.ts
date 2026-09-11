import { ResponseWrapper } from "@/types/response-wrapper.types";

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {
    method: "GET",
  },
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

  const { data, ok, errors }: ResponseWrapper<T> = await response.json();

  if (ok) {
    return data;
  } else {
    throw new Error(errors.join(", "));
  }
};
