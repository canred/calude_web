import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.number().int().positive(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1),
  postId: z.number().int().positive(),
  authorId: z.number().int().positive(),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1),
});

export const createLikeSchema = z.object({
  postId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export const deleteLikeSchema = z.object({
  postId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export const followSchema = z.object({
  followerId: z.number().int().positive(),
  followingId: z.number().int().positive(),
});

export const createMessageSchema = z.object({
  body: z.string().min(1),
  senderId: z.number().int().positive(),
  receiverId: z.number().int().positive(),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^\d+$/, 'userId must be a number'),
});
