import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('GET /api/search', () => {
  it('returns grouped results for a query', async () => {
    const res = await request(app).get('/api/search?q=test');
expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(Array.isArray(res.body.posts)).toBe(true);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it('rejects missing query param', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
  });
});
