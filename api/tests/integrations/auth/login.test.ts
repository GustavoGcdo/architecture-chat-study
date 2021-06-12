import supertest from 'supertest';
import App from '../../../src/app';
import { HttpStatus } from '../../../src/infra/adapters/http-status.enum';

describe('Route - auth', () => {
  const application = new App().getApp();

  it('Must be successful when logging in to with valid credentials', async () => {
    const validUser = {
      name: 'Thiago',
      socketId: 'asdasdaa541s'
    };
    const response = await supertest(application)
      .post('/entrar')
      .send(validUser);
    expect(response.status).toBe(HttpStatus.SUCCESS_NO_BODY);
  });
});
