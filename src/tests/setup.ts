import 'dotenv/config';
import { prisma } from '../db';
import { beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcrypt';

beforeAll(async () => {
  // Clean all tables
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Seed a test user for authenticated routes
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
