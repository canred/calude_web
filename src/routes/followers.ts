import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validate } from '../middleware/validate';
import { followSchema, userIdParamSchema } from '../schemas';

export const followersRouter = Router();

/**
 * @swagger
 * /api/users/{userId}/followers:
 *   get:
 *     tags: [Followers]
 *     summary: Get all followers of a user
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of followers
 * /api/users/{userId}/following:
 *   get:
 *     tags: [Followers]
 *     summary: Get all users a user is following
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of following
 * /api/follows:
 *   post:
 *     tags: [Followers]
 *     summary: Follow a user
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [followerId, followingId]
 *             properties:
 *               followerId: { type: integer }
 *               followingId: { type: integer }
 *     responses:
 *       201:
 *         description: Follow created
 *   delete:
 *     tags: [Followers]
 *     summary: Unfollow a user
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [followerId, followingId]
 *             properties:
 *               followerId: { type: integer }
 *               followingId: { type: integer }
 *     responses:
 *       204:
 *         description: Unfollowed
 */
followersRouter.get('/:userId/followers', validate(userIdParamSchema, 'params'), async (req: Request, res: Response) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: Number(req.params.userId) },
    include: { follower: true },
  });
  res.json({ followers: followers.map((f) => f.follower) });
});

followersRouter.get('/:userId/following', validate(userIdParamSchema, 'params'), async (req: Request, res: Response) => {
  const following = await prisma.follow.findMany({
    where: { followerId: Number(req.params.userId) },
    include: { following: true },
  });
  res.json({ following: following.map((f) => f.following) });
});

followersRouter.post('/', validate(followSchema), async (req: Request, res: Response) => {
  const follow = await prisma.follow.create({ data: req.body });
  res.status(201).json({ follow });
});

followersRouter.delete('/', validate(followSchema), async (req: Request, res: Response) => {
  const { followerId, followingId } = req.body as { followerId: number; followingId: number };
  await prisma.follow.delete({ where: { followerId_followingId: { followerId, followingId } } });
  res.status(204).send();
});
