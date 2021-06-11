import IUseCase from '../../_shared/IUseCase';
import userRepository from '../../_shared/repositories/user.repository';
import MessageDto from '../dtos/MessageDto';
import IMessageRepository from '../repositories/messageRepository.interface';
import IMessageDeliveryService from '../services/messageDelivery.interface';

export default class SendMessage implements IUseCase<MessageDto, void> {
  private messageDeliveryService: IMessageDeliveryService;
  private messageRepository: IMessageRepository;

  constructor(
    messageRepository: IMessageRepository,
    messageDeliveryService: IMessageDeliveryService
  ) {
    this.messageDeliveryService = messageDeliveryService;
    this.messageRepository = messageRepository;
  }

  handle(dto: MessageDto) {
    const { text, userName } = dto;
    const user = userRepository.findByUsername(userName);

    if (text && text.trim().length > 0 && user) {
      this.messageRepository.newMessage({
        text,
        user
      });
      this.messageDeliveryService.deliver({ text, user });
    }
  }
}
