import Login from '../../../src/modules/auth/usecases/login';

describe('Use case Login', () => {
  it('Must be successful when logging in to with valid credentials', () => {
    const loginUseCase = new Login();

    const user = {
      name: 'Thiago',
      socketId: 'asdasdaa541s'
    };

    const result = loginUseCase.handle(user);

    expect(result.isRight()).toBeDefined();
    expect(result.isRight()).toBeTruthy();
  });

  it('Must fail when logging in to with invalid credentials', () => {
    const loginUseCase = new Login();

    const userNoName = {
      name: '  ',
      socketId: 'asdasdaa541s'
    };

    const userNoSocket = {
      name: 'Thiago',
      socketId: '  '
    };

    const userNothing = {
      name: '  ',
      socketId: '  '
    };

    const resultUserNoName = loginUseCase.handle(userNoName);
    expect(resultUserNoName.isLeft()).toBeDefined();
    expect(resultUserNoName.isLeft()).toBeTruthy();

    const resultUserNoSocket = loginUseCase.handle(userNoSocket);
    expect(resultUserNoSocket.isLeft()).toBeDefined();
    expect(resultUserNoSocket.isLeft()).toBeTruthy();

    const resultUserNothing = loginUseCase.handle(userNothing);
    expect(resultUserNothing.isLeft()).toBeDefined();
    expect(resultUserNothing.isLeft()).toBeTruthy();
  });
});
