import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const messagesRouter = Router();

// Get conversation between two users
messagesRouter.get('/', async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.query as { senderId: string; receiverId: string };
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: Number(senderId), receiverId: Number(receiverId) },
        { senderId: Number(receiverId), receiverId: Number(senderId) },
      ],
    },
    orderBy: { createdAt: 'asc' },
    include: { sender: true, receiver: true },
  });
  res.json({ messages });
});

messagesRouter.get('/:id', async (req: Request, res: Response) => {
  const message = await prisma.message.findUnique({
    where: { id: Number(req.params.id) },
    include: { sender: true, receiver: true },
  });
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json({ message });
});

messagesRouter.post('/', async (req: Request, res: Response) => {
  const message = await prisma.message.create({ data: req.body });
  res.status(201).json({ message });
});

messagesRouter.delete('/:id', async (req: Request, res: Response) => {
  await prisma.message.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
