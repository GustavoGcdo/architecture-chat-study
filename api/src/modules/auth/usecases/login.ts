import { Server } from 'socket.io';
import App from '../../../app';
import userRepository from '../../_shared/repositories/user.repository';
import IUseCase from '../../_shared/IUseCase';

export interface UserLoginDto {
  name: string;
  socketId: string;
}

export default class Login implements IUseCase<void, UserLoginDto> {
  private io: Server;

  constructor() {
    const io = App.getIoServer();

    if (io) {
      this.io = io;
    } else {
      throw new Error('io server is undefined');
    }
  }

  public handle(dto: UserLoginDto): void {
    const { name, socketId } = dto;

    if (!name || name.trim().length === 0) {
      throw new Error('invalid user');
    }

    if (!socketId || socketId.trim().length === 0) {
      throw new Error('invalid socket id');
    }

    userRepository.add({ name, socketId });
    this.io.emit('enter-chat', { name, socketId });
  }
}
