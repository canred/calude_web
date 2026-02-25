import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const postsRouter = Router();

postsRouter.get('/', async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  res.json({ posts });
});

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.id) },
    include: { author: true },
  });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
});

postsRouter.post('/', async (req: Request, res: Response) => {
  const post = await prisma.post.create({ data: req.body });
  res.status(201).json({ post });
});

postsRouter.put('/:id', async (req: Request, res: Response) => {
  const post = await prisma.post.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json({ post });
});

postsRouter.delete('/:id', async (req: Request, res: Response) => {
  await prisma.post.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
