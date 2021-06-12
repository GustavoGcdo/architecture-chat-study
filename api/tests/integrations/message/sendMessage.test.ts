import supertest from 'supertest';
import App from '../../../src/app';
import { HttpStatus } from '../../../src/infra/adapters/http-status.enum';
import createValidUser from '../../helpers/userFunctions/createValidUser';

describe('Message - send message route', () => {
  const application = new App().getApp();

  beforeEach(() => {
    createValidUser();
  });

  it('Should get successful when try send message', async () => {
    const response = await supertest(application).post('/message').send({
      userName: 'Thiago',
      text: 'Mensagem de teste'
    });

    expect(response.status).toBe(HttpStatus.SUCCESS_NO_BODY);
  });

  it('Should get fail when try send message on user not exits', async () => {
    const responseNotExits = await supertest(application)
      .post('/message')
      .send({
        userName: 'Usuário',
        text: 'Mensagem de teste'
      });

    expect(responseNotExits.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('Should get fail when try send message with invalid user', async () => {
    const responseNotExits = await supertest(application)
      .post('/message')
      .send({
        userName: '  ',
        text: 'Mensagem de teste'
      });

    expect(responseNotExits.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Should get fail when try send message with invalid message', async () => {
    const responseNotExits = await supertest(application)
      .post('/message')
      .send({
        userName: 'Thiago',
        text: '   '
      });

    expect(responseNotExits.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Should get fail when try send message with invalid message and user', async () => {
    const responseNotExits = await supertest(application)
      .post('/message')
      .send({
        userName: '  ',
        text: '  '
      });

    expect(responseNotExits.status).toBe(HttpStatus.BAD_REQUEST);
  });
});
