import { Router, Request, Response } from 'express';
import { usersRouter } from './users';
import { postsRouter } from './posts';
import { commentsRouter } from './comments';
import { likesRouter } from './likes';

export const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/likes', likesRouter);
