import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { searchQuerySchema } from '../schemas';

export const searchRouter = Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search users, posts, and comments
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         description: Search query string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 *                 posts:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Post' }
 *                 comments:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Comment' }
 */
searchRouter.get('/', validate(searchQuerySchema, 'query'), async (req: Request, res: Response) => {
  const { q } = req.query as { q: string };

  const users = await prisma.user.findMany({
    where: { OR: [{ name: { contains: q } }, { email: { contains: q } }] },
  });
  const posts = await prisma.post.findMany({
    where: { OR: [{ title: { contains: q } }, { content: { contains: q } }] },
    include: { author: true },
  });
  const comments = await prisma.comment.findMany({
    where: { body: { contains: q } },
    include: { author: true, post: true },
  });

  res.json({ users, posts, comments });
});
