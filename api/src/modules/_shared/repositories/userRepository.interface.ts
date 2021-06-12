import { User } from '../models/user';

interface IUserRepository {
  add(user: User): void;
  findByUsername(userName: string): User | undefined;
  remove(socketId: string): void;
}

export default IUserRepository;
