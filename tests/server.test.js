import request from 'supertest';
import app from '../src/index.js';

describe('Server', () => {
  it('should respond to health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });

  it('should parse JSON body', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Test todo' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test todo');
  });
});
