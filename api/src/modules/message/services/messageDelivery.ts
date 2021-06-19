import { Server } from 'socket.io';
import App from '../../../app';
import IMessageDeliveryService, {
  MessageToSend
} from './messageDelivery.interface';

class MessageDeliveryService implements IMessageDeliveryService {
  private io: Server;

  constructor() {
    const io = App.getIoServer();

    if (io) {
      this.io = io;
    } else {
      throw new Error('Io not initialized!');
    }
  }

  deliver(message: MessageToSend): void {
    this.io.emit('message', message);
  }
}

export default MessageDeliveryService;
