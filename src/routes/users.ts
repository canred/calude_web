import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const usersRouter = Router();

usersRouter.get('/', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

usersRouter.get('/:id', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

usersRouter.post('/', async (req: Request, res: Response) => {
  const user = await prisma.user.create({ data: req.body });
  res.status(201).json({ user });
});

usersRouter.put('/:id', async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json({ user });
});

usersRouter.delete('/:id', async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
