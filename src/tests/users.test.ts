import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import { getToken } from './helpers';

let token: string;
let userId: number;

beforeAll(async () => {
  token = await getToken();
});

describe('GET /api/users', () => {
  it('returns list of users', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/:id', () => {
  it('returns a user', async () => {
    const list = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    userId = list.body.users[0].id;
    const res = await request(app).get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(userId);
  });

  it('returns 404 for unknown user', async () => {
    const res = await request(app).get('/api/users/99999').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
