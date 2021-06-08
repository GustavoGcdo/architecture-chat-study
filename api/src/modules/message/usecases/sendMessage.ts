import { Server } from 'socket.io';
import App from '../../../app';
import userRepository from '../../_shared/repositories/user.repository';
import IUseCase from '../../_shared/IUseCase';
import MessageDto from '../dtos/MessageDto';
import messageRepository from '../repositories/messageRepository';

export default class SendMessage implements IUseCase {
  private io: Server;

  constructor() {
    const io = App.getIoServer();

    if (!io) {
      throw new Error('Io server is undefined');
    }

    this.io = io;
  }

  handle(dto: MessageDto) {
    const { text, userName } = dto;
    const user = userRepository.findByUsername(userName);

    if (text && text.trim().length > 0 && user) {
      messageRepository.newMessage({
        text,
        user
      });
      this.io.emit('message', { text, user });
    }
  }
}
