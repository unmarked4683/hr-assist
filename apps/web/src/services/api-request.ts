import { ResponseWrapper } from "@/types/response-wrapper.types";
import { toast } from "sonner";

export interface ApiRequestOptions extends RequestInit {
  hideToastOnNetworkError?: boolean;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { hideToastOnNetworkError = false, ...fetchOptions } = options;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL(endpoint, baseUrl).toString();

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      credentials: "include",
    });
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      console.error("UNKNOWN ERROR WHICH IS NOT AN INSTANCE OF ERROR", error);
      throw error;
    }

    const { message } = error;
    if (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError")
    ) {
      const errorMessage =
        "Brak połączenia z serwerem (backend wyłączony lub zablokowany przez sieć).";

      if (!hideToastOnNetworkError) {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
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
