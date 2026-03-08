export const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};

export function isActivePath(currentPath: string, itemPath: string): boolean {
  if (itemPath === "/") return currentPath === "/";

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

export const jsonObject = (data: any) => {
  if (!data) return data;

  return JSON.parse(JSON.stringify(data));
};

export const isErrorResponse = (response: any) => {
  const status = response?.status;
  return status < 200 || status >= 300;
};
