import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { createMessageSchema, idParamSchema } from '../schemas';
import { z } from 'zod';

export const messagesRouter = Router();

const conversationQuerySchema = z.object({
  senderId: z.string().regex(/^\d+$/),
  receiverId: z.string().regex(/^\d+$/),
});

/**
 * @swagger
 * /api/messages:
 *   get:
 *     tags: [Messages]
 *     summary: Get conversation between two users
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: senderId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: receiverId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of messages
 *   post:
 *     tags: [Messages]
 *     summary: Send a message
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [body, senderId, receiverId]
 *             properties:
 *               body: { type: string }
 *               senderId: { type: integer }
 *               receiverId: { type: integer }
 *     responses:
 *       201:
 *         description: Message sent
 * /api/messages/{id}:
 *   get:
 *     tags: [Messages]
 *     summary: Get a message by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Message found
 *       404:
 *         description: Message not found
 *   delete:
 *     tags: [Messages]
 *     summary: Delete a message
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Message deleted
 */
messagesRouter.get('/', validate(conversationQuerySchema, 'query'), async (req: Request, res: Response) => {
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

messagesRouter.get('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  const message = await prisma.message.findUnique({
    where: { id: Number(req.params.id) },
    include: { sender: true, receiver: true },
  });
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json({ message });
});

messagesRouter.post('/', validate(createMessageSchema), async (req: Request, res: Response) => {
  const message = await prisma.message.create({ data: req.body });
  res.status(201).json({ message });
});

messagesRouter.delete('/:id', validate(idParamSchema, 'params'), async (req: Request, res: Response) => {
  await prisma.message.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
