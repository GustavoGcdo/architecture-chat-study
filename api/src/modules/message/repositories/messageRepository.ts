import { Message } from '../models/message';
import IMessageRepository from './messageRepository.interface';

class MessageRepository implements IMessageRepository {
  private messages: Message[];

  constructor() {
    this.messages = [];
  }

  get(): Message[] {
    return this.messages;
  }

  newMessage(message: Message) {
    this.messages.push(message);
  }
}

export default new MessageRepository();
