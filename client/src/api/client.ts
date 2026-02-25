const BASE = '/api';

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (null as T) : res.json();
}
