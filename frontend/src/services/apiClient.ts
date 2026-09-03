import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...init.headers },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `${response.status}${message ? `: ${message}` : `: ${response.statusText}`}`,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
