import { mock } from 'jest-mock-extended';
import IEncryptService from '../../../src/modules/auth/service/encryptService.interface';
import InvalidValuesError from '../../../src/modules/user/errors/invalidValues.error';
import User from '../../../src/modules/user/models/user';
import IUserRepository from '../../../src/modules/user/repositories/userRepository.interface';
import CreateUser from '../../../src/modules/user/usecases/createUser';
import IEmailService from '../../../src/modules/_shared/services/emailService.interface';

describe('Use case create new user', () => {
  const mockUserRepository = mock<IUserRepository>();
  const mockEncryptService = mock<IEncryptService>();
  const mockEmailService = mock<IEmailService>();

  const createUserUseCase = new CreateUser(
    mockUserRepository,
    mockEncryptService,
    mockEmailService
  );

  it('Should create a new user', async () => {
    mockUserRepository.create.mockReturnValueOnce({
      id: 1,
      completeName: 'Thiago Augusto Gonçalves Silva',
      displayName: 'Thiago Augusto',
      birthDate: new Date('2000-07-06'),
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth',
      createdAt: new Date()
    });
    mockEncryptService.encrypt.mockResolvedValue('odfnowdfnowdn');
    const jestSpyEncryptMethod = jest.spyOn(mockEncryptService, 'encrypt');

    const validUser = {
      completeName: 'Thiago Augusto Gonçalves Silva',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth'
    };

    const result = await createUserUseCase.handle(validUser);

    if (result.isLeft()) {
      console.log(result.value.getErros());
    }

    const resultToTest = result.value as User;

    expect(result.isRight()).toBeDefined();
    expect(result.isRight()).toBeTruthy();
    expect(jestSpyEncryptMethod).toHaveBeenCalled();
    expect(resultToTest.id).toBeDefined();
    expect(resultToTest.createdAt).toBeDefined();
    expect(resultToTest.email).toStrictEqual(validUser.email);
    expect(resultToTest.completeName).toStrictEqual(validUser.completeName);
    expect(resultToTest.password).not.toEqual(validUser.password);
    expect(resultToTest.birthDate.toISOString()).toStrictEqual(
      new Date(validUser.birthDate).toISOString()
    );
    expect(resultToTest.displayName).toStrictEqual(validUser.displayName);
    expect(resultToTest.userName).toStrictEqual(validUser.userName);
  });

  it('Should fail when try create user with invalid email', async () => {
    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggthgmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual(['Invalid e-mail']);
  });

  it('Should fail when try create user without email', async () => {
    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: '  ',
      password: 'passwordFort',
      userName: 'thiagoggth'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual([
      'Email is Required',
      'Invalid e-mail'
    ]);
  });

  it('Should fail when try create user without complete name', async () => {
    const validUser = {
      completeName: '  ',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual(['Name is required']);
  });

  it('Should fail when try create user without password', async () => {
    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: '  ',
      userName: 'thiagoggth'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual(['Password is required']);
  });

  it('Should fail when try create user without username', async () => {
    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: 'senhaForte',
      userName: '  '
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual([
      'Username is required',
      'Invalid username'
    ]);
  });

  it('Should fail when try create user with invalid username', async () => {
    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: 'senhaForte',
      userName: 'username mas'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual(['Invalid username']);
  });

  it('Should fail when try create user with email already registered', async () => {
    mockUserRepository.findByEmail.mockReturnValueOnce({
      id: 1,
      completeName: 'Thiago Augusto Gonçalves Silva',
      displayName: 'Thiago Augusto',
      birthDate: new Date('2000-07-06'),
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth',
      createdAt: new Date()
    });

    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: 'senhaForte',
      userName: 'username'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual([
      'This e-mail is already registered'
    ]);
  });

  it('Should fail when try create user with username already registered', async () => {
    mockUserRepository.findByUsername.mockReturnValueOnce({
      id: 1,
      completeName: 'Thiago Augusto Gonçalves Silva',
      displayName: 'Thiago Augusto',
      birthDate: new Date('2000-07-06'),
      email: 'thiagoggth@gmail.com',
      password: 'passwordFort',
      userName: 'thiagoggth',
      createdAt: new Date()
    });

    const validUser = {
      completeName: 'Thiago Augusto',
      displayName: 'Thiago Augusto',
      birthDate: '2000-07-06',
      email: 'thiagoggth@gmail.com',
      password: 'senhaForte',
      userName: 'username'
    };

    const result = await createUserUseCase.handle(validUser);
    const resultValue = result.value as InvalidValuesError;

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
    expect(resultValue.getErros().length > 0).toBeTruthy();
    expect(resultValue.getErros()).toEqual([
      'This username is already registered'
    ]);
  });
});
