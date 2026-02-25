import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas';

export const authRouter = Router();

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'change-me-in-production';

authRouter.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email: string; password: string; name?: string };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });

  const { password: _, ...safeUser } = user;
  res.status(201).json({ user: safeUser });
});

authRouter.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});
