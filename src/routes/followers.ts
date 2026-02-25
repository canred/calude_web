import { Router, Request, Response } from 'express';
import { prisma } from '../db';

export const followersRouter = Router();

// Get all followers of a user
followersRouter.get('/:userId/followers', async (req: Request, res: Response) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: Number(req.params.userId) },
    include: { follower: true },
  });
  res.json({ followers: followers.map((f) => f.follower) });
});

// Get all users a user is following
followersRouter.get('/:userId/following', async (req: Request, res: Response) => {
  const following = await prisma.follow.findMany({
    where: { followerId: Number(req.params.userId) },
    include: { following: true },
  });
  res.json({ following: following.map((f) => f.following) });
});

// Follow a user
followersRouter.post('/', async (req: Request, res: Response) => {
  const follow = await prisma.follow.create({ data: req.body });
  res.status(201).json({ follow });
});

// Unfollow a user
followersRouter.delete('/', async (req: Request, res: Response) => {
  const { followerId, followingId } = req.body as { followerId: number; followingId: number };
  await prisma.follow.delete({ where: { followerId_followingId: { followerId, followingId } } });
  res.status(204).send();
});
