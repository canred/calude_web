import { apiFetch } from './client';

export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  author: { id: number; name: string | null; email: string };
  _count?: { comments: number; likes: number };
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  authorId: number;
  createdAt: string;
  author: { id: number; name: string | null; email: string };
}

export interface Like {
  id: number;
  postId: number;
  userId: number;
}

export function getPosts() {
  return apiFetch<{ posts: Post[] }>('/posts');
}

export function getPost(id: number) {
  return apiFetch<{ post: Post }>(`/posts/${id}`);
}

export function createPost(title: string, content: string) {
  const userId = Number(localStorage.getItem('userId'));
  return apiFetch<{ post: Post }>('/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content, authorId: userId, published: true }),
  });
}

export function deletePost(id: number) {
  return apiFetch(`/posts/${id}`, { method: 'DELETE' });
}

export function getComments(postId: number) {
  return apiFetch<{ comments: Comment[] }>(`/comments?postId=${postId}`);
}

export function createComment(postId: number, body: string) {
  const authorId = Number(localStorage.getItem('userId'));
  return apiFetch<{ comment: Comment }>('/comments', {
    method: 'POST',
    body: JSON.stringify({ postId, body, authorId }),
  });
}

export function deleteComment(id: number) {
  return apiFetch(`/comments/${id}`, { method: 'DELETE' });
}

export function likePost(postId: number) {
  const userId = Number(localStorage.getItem('userId'));
  return apiFetch<{ like: Like }>('/likes', {
    method: 'POST',
    body: JSON.stringify({ postId, userId }),
  });
}

export function unlikePost(postId: number) {
  const userId = Number(localStorage.getItem('userId'));
  return apiFetch('/likes', {
    method: 'DELETE',
    body: JSON.stringify({ postId, userId }),
  });
}

export function getLikes() {
  return apiFetch<{ likes: Like[] }>('/likes');
}
