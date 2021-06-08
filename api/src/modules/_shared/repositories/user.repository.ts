import { User } from '../models/user';

class UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  add(user: User) {
    this.users.push(user);
  }

  findByUsername(userName: string) {
    return this.users.find((u) => (u.name = userName));
  }

  remove(socketId: string) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }
}

export default new UserRepository();
