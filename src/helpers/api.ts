// Keep requests on the local Vite proxy. Only a same-origin path is configurable.
const configuredBase = import.meta.env.VITE_API_BASE_URL || "/api";
export const API_BASE_URL = /^\/(?!\/)[A-Za-z0-9/_-]*$/.test(configuredBase)
  ? configuredBase.replace(/\/+$/, "")
  : "/api";

export const apiUrl = (path: string) => `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
