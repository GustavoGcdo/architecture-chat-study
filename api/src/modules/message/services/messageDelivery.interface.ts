import { Message } from '../models/message';

interface IMessageDeliveryService {
  deliver(message: Message): void;
}

export default IMessageDeliveryService;
