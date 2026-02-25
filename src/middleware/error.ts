import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Prisma known errors (constraint violations, not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({ error: 'A record with that value already exists' });
      case 'P2025':
        return res.status(404).json({ error: 'Record not found' });
      default:
        return res.status(400).json({ error: `Database error: ${err.code}` });
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  // Generic errors
  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}
