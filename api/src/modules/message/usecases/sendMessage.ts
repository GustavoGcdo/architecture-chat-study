import { Either, left, right } from '../../../infra/result';
import User from '../../user/models/user';
import IUserRepository from '../../user/repositories/userRepository.interface';
import IUseCase from '../../_shared/IUseCase';
import MessageDto from '../dtos/MessageDto';
import InvalidMessageError from '../errors/invalidMessage.error';
import InvalidUserNameError from '../errors/invalidUserName.error';
import UserNotFoundError from '../errors/userNotFound.error';
import IMessageRepository from '../repositories/messageRepository.interface';
import IMessageDeliveryService from '../services/messageDelivery.interface';

type validateRight = { user: User; text: string };
type validateLeft =
  | InvalidUserNameError
  | UserNotFoundError
  | InvalidMessageError;

type validate = Either<validateLeft, validateRight>;
type validateUser = Either<InvalidUserNameError | UserNotFoundError, User>;
type validateMessage = Either<InvalidMessageError, string>;

type handleReturn = Either<validateLeft, void>;
export default class SendMessage implements IUseCase<MessageDto, void> {
  private messageDeliveryService: IMessageDeliveryService;
  private userRepository: IUserRepository;
  private messageRepository: IMessageRepository;

  constructor(
    messageRepository: IMessageRepository,
    userRepository: IUserRepository,
    messageDeliveryService: IMessageDeliveryService
  ) {
    this.messageDeliveryService = messageDeliveryService;
    this.userRepository = userRepository;
    this.messageRepository = messageRepository;
  }

  handle(dto: MessageDto): handleReturn {
    const validateResult = this.validate(dto);

    if (validateResult.isRight()) {
      const { text, user } = validateResult.value;

      if (!user.id) {
        throw new Error('Send message: Internal server error');
      }

      this.messageRepository.newMessage({
        text,
        userId: user.id
      });

      this.messageDeliveryService.deliver({
        text,
        user: user.displayName || user.completeName
      });
      return right(undefined);
    }

    return left(validateResult.value);
  }

  private validate(dto: MessageDto): validate {
    const { userName, text } = dto;
    const userResult = this.validateUser(userName);
    const messageResult = this.validateMessage(text);

    if (userResult.isRight() && messageResult.isRight()) {
      return right({
        text: messageResult.value,
        user: userResult.value
      });
    }

    if (userResult.isLeft()) {
      return left(userResult.value);
    }

    if (messageResult.isLeft()) {
      return left(messageResult.value);
    }
    throw new Error('Unknown error');
  }

  private validateUser(userName: string): validateUser {
    if (userName && userName.trim().length > 0) {
      const user = this.userRepository.findByUsername(userName);
      if (!user) {
        return left(new UserNotFoundError());
      }
      return right(user);
    } else {
      return left(new InvalidUserNameError());
    }
  }

  private validateMessage(message: string): validateMessage {
    if (message && message.trim().length > 0) {
      return right(message);
    }
    return left(new InvalidMessageError());
  }
}
