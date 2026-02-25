import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { createPostSchema, updatePostSchema, idParamSchema } from '../schemas';

export const postsRouter = Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Post' }
 *   post:
 *     tags: [Posts]
 *     summary: Create a post
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, authorId]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               published: { type: boolean }
 *               authorId: { type: integer }
 *     responses:
 *       201:
 *         description: Post created
 */
postsRouter.get('/', async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  res.json({ posts });
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 *   put:
 *     tags: [Posts]
 *     summary: Update a post
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               published: { type: boolean }
 *     responses:
 *       200:
 *         description: Post updated
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Post deleted
 */
postsRouter.get('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.id) },
    include: { author: true },
  });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
});

postsRouter.post('/', validate(createPostSchema), async (req: Request, res: Response) => {
  const post = await prisma.post.create({ data: req.body });
  res.status(201).json({ post });
});

postsRouter.put('/:id', validate(idParamSchema, 'params'), validate(updatePostSchema), async (req: Request, res: Response) => {
  const post = await prisma.post.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json({ post });
});

postsRouter.delete('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  await prisma.post.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
