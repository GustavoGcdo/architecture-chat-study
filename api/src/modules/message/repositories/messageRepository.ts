import { Message } from '../models/message';

class MessageRepository {
  private messages: Message[];

  constructor() {
    this.messages = [];
  }

  get() {
    return this.messages;
  }

  newMessage(message: Message) {
    this.messages.push(message);
    console.log(this.messages);
  }
}

export default new MessageRepository();
