import { ApiRoute } from "@/utils/Api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

// fetcher now accepts route function with optional params
export const ApiClient = async <T = any>(
  routeFn: (...args: any[]) => ApiRoute,
  payloadOrParams?: any
): Promise<ApiResponse<T>> => {
  // call the route function to get the actual ApiRoute
  const apiRoute: ApiRoute =
    typeof routeFn === "function"
      ? routeFn(payloadOrParams)
      : (routeFn as ApiRoute);

  const { url, method } = apiRoute;

  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  };

  // Attach body only for non-GET
  if (payloadOrParams && method !== "GET") {
    options.body = JSON.stringify(payloadOrParams);
  }

  const res = await fetch(url, options);
  const json = await res.json();

  if (res.ok) {
    return { success: true, data: json.data ?? json, status: res.status };
  } else {
    return {
      success: false,
      error: json.error ?? json.message ?? "Unknown error",
      status: res.status,
    };
  }
};
