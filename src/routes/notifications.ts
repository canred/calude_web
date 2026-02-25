import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const notificationsRouter = Router();

// Get all notifications for a user
notificationsRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = req.query as { userId: string };
  const notifications = await prisma.notification.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ notifications });
});

// Mark a notification as read
notificationsRouter.put('/:id/read', async (req: Request, res: Response) => {
  const notification = await prisma.notification.update({
    where: { id: Number(req.params.id) },
    data: { read: true },
  });
  res.json({ notification });
});

// Mark all notifications as read for a user
notificationsRouter.put('/read-all', async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: number };
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  res.status(204).send();
});

notificationsRouter.delete('/:id', async (req: Request, res: Response) => {
  await prisma.notification.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
