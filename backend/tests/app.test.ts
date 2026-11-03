import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app.js';

describe('API smoke tests', () => {
  it('returns an ok health response', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('healthy');
    expect(response.body.data.status).toBe('ok');
  });

  it('validates corporate inquiries before storing them', async () => {
    const response = await request(app).post('/api/v1/inquiries/corporate').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
  });

  it('requires an authenticated administrator to view inquiries', async () => {
    const response = await request(app).get('/api/v1/admin/inquiries');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
