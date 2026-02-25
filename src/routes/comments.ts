import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { createCommentSchema, updateCommentSchema, idParamSchema } from '../schemas';

export const commentsRouter = Router();

commentsRouter.get('/', async (_req: Request, res: Response) => {
  const comments = await prisma.comment.findMany({ include: { author: true, post: true } });
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
