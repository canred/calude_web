import request from 'supertest';
import app from '../index';

export async function getToken(email = 'test@example.com', password = 'password123'): Promise<string> {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token as string;
}

export async function authRequest(method: 'get' | 'post' | 'put' | 'delete', url: string, token: string) {
  return request(app)[method](url).set('Authorization', `Bearer ${token}`);
}
