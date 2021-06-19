import { mock } from 'jest-mock-extended';
import IMessageRepository from '../../../src/modules/message/repositories/messageRepository.interface';
import IMessageDeliveryService from '../../../src/modules/message/services/messageDelivery.interface';
import SendMessage from '../../../src/modules/message/usecases/sendMessage';
import IUserRepository from '../../../src/modules/user/repositories/userRepository.interface';

describe('Use case Send message', () => {
  const mockMessageRepository = mock<IMessageRepository>();
  const mockUserRepository = mock<IUserRepository>();
  const mockMessageDeliveryService = mock<IMessageDeliveryService>();

  beforeEach(() => {
    mockUserRepository.findByUsername.mockReset();
  });

  it('Must be successful when send message', () => {
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

    const sendMessageUseCase = new SendMessage(
      mockMessageRepository,
      mockUserRepository,
      mockMessageDeliveryService
    );

    const validMessage = {
      userName: 'Thiago',
      text: 'texto de teste'
    };

    const result = sendMessageUseCase.handle(validMessage);

    expect(result.isRight()).toBeDefined();
    expect(result.isRight()).toBeTruthy();
  });

  it('Must be fail when not found user', () => {
    mockUserRepository.findByUsername.mockReturnValue(undefined);

    const sendMessageUseCase = new SendMessage(
      mockMessageRepository,
      mockUserRepository,
      mockMessageDeliveryService
    );

    const validMessage = {
      userName: 'Thiago',
      text: 'texto de teste'
    };

    const result = sendMessageUseCase.handle(validMessage);

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
  });

  it('Must be fail when not has user name', () => {
    const sendMessageUseCase = new SendMessage(
      mockMessageRepository,
      mockUserRepository,
      mockMessageDeliveryService
    );

    const validMessage = {
      userName: '  ',
      text: 'texto de teste'
    };

    const result = sendMessageUseCase.handle(validMessage);

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
  });

  it('Must be fail when not has message text', () => {
    const sendMessageUseCase = new SendMessage(
      mockMessageRepository,
      mockUserRepository,
      mockMessageDeliveryService
    );

    const validMessage = {
      userName: 'Thiago',
      text: '   '
    };

    const result = sendMessageUseCase.handle(validMessage);

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
  });

  it('Must be fail when not has message text and user name', () => {
    const sendMessageUseCase = new SendMessage(
      mockMessageRepository,
      mockUserRepository,
      mockMessageDeliveryService
    );

    const validMessage = {
      userName: '  ',
      text: '   '
    };

    const result = sendMessageUseCase.handle(validMessage);

    expect(result.isLeft()).toBeDefined();
    expect(result.isLeft()).toBeTruthy();
  });
});
