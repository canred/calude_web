import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { createCommentSchema, updateCommentSchema, idParamSchema } from '../schemas';

export const commentsRouter = Router();

/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of comments
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [body, postId, authorId]
 *             properties:
 *               body: { type: string }
 *               postId: { type: integer }
 *               authorId: { type: integer }
 *     responses:
 *       201:
 *         description: Comment created
 * /api/comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Get a comment by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Comment found
 *       404:
 *         description: Comment not found
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body: { type: string }
 *     responses:
 *       200:
 *         description: Comment updated
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Comment deleted
 */
commentsRouter.get('/', async (req: Request, res: Response) => {
  const { postId } = req.query as { postId?: string };
  const comments = await prisma.comment.findMany({
    where: postId ? { postId: Number(postId) } : undefined,
    include: { author: true, post: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ comments });
});

commentsRouter.get('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(req.params.id) },
    include: { author: true, post: true },
  });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json({ comment });
});

commentsRouter.post('/', validate(createCommentSchema), async (req: Request, res: Response) => {
  const comment = await prisma.comment.create({ data: req.body });
  res.status(201).json({ comment });
});

commentsRouter.put('/:id', validate(idParamSchema, 'params'), validate(updateCommentSchema), async (req: Request, res: Response) => {
  const comment = await prisma.comment.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json({ comment });
});

commentsRouter.delete('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  await prisma.comment.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
