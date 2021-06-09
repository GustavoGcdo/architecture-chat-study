import { Message } from '../models/message';

interface IMessageRepository {
  get: () => Message[];
  newMessage: (message: Message) => void;
}

export default IMessageRepository;
