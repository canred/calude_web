import { apiFetch } from './client';

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
}

export function getUsers() {
  return apiFetch<{ users: User[] }>('/users');
}

export function getUser(id: number) {
  return apiFetch<{ user: User }>(`/users/${id}`);
}

export function getFollowers(userId: number) {
  return apiFetch<{ followers: User[] }>(`/users/${userId}/followers`);
}

export function getFollowing(userId: number) {
  return apiFetch<{ following: User[] }>(`/users/${userId}/following`);
}

export function follow(followerId: number, followingId: number) {
  return apiFetch('/follows', {
    method: 'POST',
    body: JSON.stringify({ followerId, followingId }),
  });
}

export function unfollow(followerId: number, followingId: number) {
  return apiFetch('/follows', {
    method: 'DELETE',
    body: JSON.stringify({ followerId, followingId }),
  });
}
