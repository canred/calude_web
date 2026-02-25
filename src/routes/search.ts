import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { searchQuerySchema } from '../schemas';

export const searchRouter = Router();

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
