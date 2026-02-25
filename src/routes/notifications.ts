import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const notificationsRouter = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications for a user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of notifications
 * /api/notifications/read-all:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: integer }
 *     responses:
 *       204:
 *         description: All notifications marked as read
 * /api/notifications/{id}/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Notification updated
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Notification deleted
 */
notificationsRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = req.query as { userId: string };
  const notifications = await prisma.notification.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ notifications });
});

notificationsRouter.put('/:id/read', async (req: Request, res: Response) => {
  const notification = await prisma.notification.update({
    where: { id: Number(req.params.id) },
    data: { read: true },
  });
  res.json({ notification });
});

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
