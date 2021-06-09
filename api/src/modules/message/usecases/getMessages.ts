import IUseCase from '../../_shared/IUseCase';
import { Message } from '../models/message';
import IMessageRepository from '../repositories/messageRepository.interface';

class GetMessages implements IUseCase<undefined, Message[]> {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  handle() {
    return this.messageRepository.get();
  }
}

export default GetMessages;
