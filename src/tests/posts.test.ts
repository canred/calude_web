import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import { getToken } from './helpers';

let token: string;
let userId: number;
let postId: number;

beforeAll(async () => {
  token = await getToken();
  const users = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
  userId = users.body.users[0].id;
});

describe('POST /api/posts', () => {
  it('creates a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Hello World', content: 'My first post', authorId: userId });
    expect(res.status).toBe(201);
    expect(res.body.post.title).toBe('Hello World');
    postId = res.body.post.id;
  });

  it('rejects missing title', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ authorId: userId });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/posts', () => {
  it('returns list of posts', async () => {
    const res = await request(app).get('/api/posts').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });
});

describe('GET /api/posts/:id', () => {
  it('returns a post', async () => {
    const res = await request(app).get(`/api/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.post.id).toBe(postId);
  });

  it('returns 404 for unknown post', async () => {
    const res = await request(app).get('/api/posts/99999').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('updates a post', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe('Updated Title');
  });
});

describe('DELETE /api/posts/:id', () => {
  it('deletes a post', async () => {
    const res = await request(app).delete(`/api/posts/${postId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
