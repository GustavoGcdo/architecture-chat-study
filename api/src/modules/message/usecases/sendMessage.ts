import { Server } from 'socket.io';
import App from '../../../app';
import userRepository from '../../_shared/repositories/user.repository';
import IUseCase from '../../_shared/IUseCase';
import MessageDto from '../dtos/MessageDto';
import IMessageRepository from '../repositories/messageRepository.interface';

export default class SendMessage implements IUseCase<MessageDto, void> {
  private io: Server;
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    const io = App.getIoServer();

    if (!io) {
      throw new Error('Io server is undefined');
    }

    this.io = io;
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
      this.io.emit('message', { text, user });
    }
  }
}
