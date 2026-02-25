import { apiFetch } from './client';

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
}

export function login(email: string, password: string) {
  return apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, password: string, name: string) {
  return apiFetch<{ token: string; user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}
