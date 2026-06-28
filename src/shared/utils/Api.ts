type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRoute {
  url: string;
  method: Method;
}

const Api = {
  GET: (url: string) => ({ url, method: "GET" as const }),
  POST: (url: string) => ({ url, method: "POST" as const }),
  PUT: (url: string) => ({ url, method: "PUT" as const }),
  DELETE: (url: string) => ({ url, method: "DELETE" as const }),
  PATCH: (url: string) => ({ url, method: "PATCH" as const }),
};

export type { ApiRoute };
export default Api;
