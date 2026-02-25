import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const likesRouter = Router();

likesRouter.get('/', async (_req: Request, res: Response) => {
  const likes = await prisma.like.findMany({ include: { user: true, post: true } });
  res.json({ likes });
});

likesRouter.post('/', async (req: Request, res: Response) => {
  const like = await prisma.like.create({ data: req.body });
  res.status(201).json({ like });
});

likesRouter.delete('/', async (req: Request, res: Response) => {
  const { postId, userId } = req.body as { postId: number; userId: number };
  await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
  res.status(204).send();
});
