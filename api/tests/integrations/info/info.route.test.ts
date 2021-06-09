import supertest from 'supertest';
import App from '../../../src/app';

describe('Route - API Info', () => {
  const application = new App().getApp();

  it('Should return basic API information', async () => {
    const response = await supertest(application).get('/');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('architecture-chat-study-api');
    expect(response.body.version).toBe('1.0');
  });
});
