import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema, idParamSchema } from '../schemas';

export const usersRouter = Router();

usersRouter.get('/', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

usersRouter.get('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

usersRouter.post('/', validate(createUserSchema), async (req: Request, res: Response) => {
  const user = await prisma.user.create({ data: req.body });
  res.status(201).json({ user });
});

usersRouter.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema), async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json({ user });
});

usersRouter.delete('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
