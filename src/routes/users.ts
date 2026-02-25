import { Router, Request, Response } from 'express';

export const usersRouter = Router();

usersRouter.get('/', (_req: Request, res: Response) => {
  res.json({ users: [] });
});

usersRouter.get('/:id', (req: Request, res: Response) => {
  res.json({ id: req.params.id });
});

usersRouter.post('/', (req: Request, res: Response) => {
  res.status(201).json({ user: req.body });
});

usersRouter.put('/:id', (req: Request, res: Response) => {
  res.json({ id: req.params.id, ...req.body });
});

usersRouter.delete('/:id', (req: Request, res: Response) => {
  res.status(204).send();
});
