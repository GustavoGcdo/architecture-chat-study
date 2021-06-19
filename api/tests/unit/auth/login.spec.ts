import { mock } from 'jest-mock-extended';
import InvalidPasswordError from '../../../src/modules/auth/errors/invalidPassword.error';
import IEncryptService from '../../../src/modules/auth/service/encryptService.interface';
import { IJwtService } from '../../../src/modules/auth/service/jwtService.interface';
import Login from '../../../src/modules/auth/usecases/login';
import UserNotFoundError from '../../../src/modules/message/errors/userNotFound.error';
import IUserRepository from '../../../src/modules/user/repositories/userRepository.interface';
import InvalidValuesError from '../../../src/modules/_shared/errors/invalidValues.error';

describe('Use case Login', () => {
  const mockUserRepository = mock<IUserRepository>();
  const mockEncryptService = mock<IEncryptService>();
  const mockJwtService = mock<IJwtService>();

  const loginUseCase = new Login(
    mockUserRepository,
    mockEncryptService,
    mockJwtService
  );

  it('Must be successful when logging in to with valid credentials', async () => {
    mockEncryptService.compare.mockResolvedValueOnce(true);
    mockJwtService.generateToken.mockReturnValueOnce('token');
    mockUserRepository.findByUsernameOrEmail.mockReturnValueOnce({
      id: 1,
      completeName: 'Thiago Augusto Gonçalves Silva',
      displayName: 'Thiago Augusto',
      birthDate: new Date('2000-07-06'),
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth',
      createdAt: new Date()
    });

    const result = await loginUseCase.handle({
      password: 'passwordFort',
      userNameOrEmail: 'thiagoggth@gmail.com'
    });

    const resultToTest = result.value as { token: string };

    expect(result.isRight()).toBeDefined();
    expect(result.isRight()).toBeTruthy();
    expect(resultToTest.token).toBeDefined();
  });

  it('Must fail when logging with invalid credentials', async () => {
    const userNoName = {
      userNameOrEmail: '  ',
      password: 'asdasdaa541s'
    };

    const userNoPassword = {
      userNameOrEmail: 'Thiago',
      password: '  '
    };

    const userNothing = {
      userNameOrEmail: '  ',
      password: '  '
    };

    const resultUserNoName = await loginUseCase.handle(userNoName);
    expect(resultUserNoName.isLeft()).toBeDefined();
    expect(resultUserNoName.isLeft()).toBeTruthy();
    expect(resultUserNoName.value).toBeInstanceOf(InvalidValuesError);

    const resultUserNoSocket = await loginUseCase.handle(userNoPassword);
    expect(resultUserNoSocket.isLeft()).toBeDefined();
    expect(resultUserNoSocket.isLeft()).toBeTruthy();
    expect(resultUserNoName.value).toBeInstanceOf(InvalidValuesError);

    const resultUserNothing = await loginUseCase.handle(userNothing);
    expect(resultUserNothing.isLeft()).toBeDefined();
    expect(resultUserNothing.isLeft()).toBeTruthy();
    expect(resultUserNoName.value).toBeInstanceOf(InvalidValuesError);
  });

  it('Must fail when not found user', async () => {
    mockUserRepository.findByUsernameOrEmail.mockReturnValueOnce(undefined);

    const result = await loginUseCase.handle({
      userNameOrEmail: 'thiagoggth',
      password: 'asdasdaa541s'
    });

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('Must fail when invalid password', async () => {
    mockUserRepository.findByUsernameOrEmail.mockReturnValueOnce({
      id: 1,
      completeName: 'Thiago Augusto Gonçalves Silva',
      displayName: 'Thiago Augusto',
      birthDate: new Date('2000-07-06'),
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth',
      createdAt: new Date()
    });
    mockEncryptService.compare.mockResolvedValueOnce(false);
    mockJwtService.generateToken.mockReturnValueOnce('token');

    const result = await loginUseCase.handle({
      userNameOrEmail: 'thiagoggth',
      password: 'asdasdaa541s'
    });

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });
});
