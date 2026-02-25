import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { authRouter } from './auth';
import { usersRouter } from './users';
import { postsRouter } from './posts';
import { commentsRouter } from './comments';
import { likesRouter } from './likes';
import { followersRouter } from './followers';
import { messagesRouter } from './messages';
import { notificationsRouter } from './notifications';
import { searchRouter } from './search';

export const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/search', searchRouter);

// Protected routes — require a valid JWT
router.use(requireAuth);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/likes', likesRouter);
router.use('/users', followersRouter);
router.use('/follows', followersRouter);
router.use('/messages', messagesRouter);
router.use('/notifications', notificationsRouter);
