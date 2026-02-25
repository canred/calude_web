import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const searchRouter = Router();

searchRouter.get('/', async (req: Request, res: Response) => {
  const { q } = req.query as { q: string };

  if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

  const [users, posts, comments] = await Promise.all([
    prisma.user.findMany({
      where: { OR: [{ name: { contains: q } }, { email: { contains: q } }] },
    }),
    prisma.post.findMany({
      where: { OR: [{ title: { contains: q } }, { content: { contains: q } }] },
      include: { author: true },
    }),
    prisma.comment.findMany({
      where: { body: { contains: q } },
      include: { author: true, post: true },
    }),
  ]);

  res.json({ users, posts, comments });
});
