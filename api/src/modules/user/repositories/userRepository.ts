import { UserMapper } from '../mappers/userMapper';
import User from '../models/user';
import UserSchema from '../schemes/userSchema';
import IUserRepository from './userRepository.interface';

class UserRepository implements IUserRepository {
  private users: UserSchema[];

  constructor() {
    this.users = [];
  }

  create(user: User): User {
    user.id = this.users.length + 1;
    const userMapped = UserMapper.modelToSchema(user);

    this.users.push(userMapped);

    return UserMapper.schemaToModel(userMapped);
  }

  findByUsername(userName: string): User | undefined {
    const userFound = this.users.find((user) => user.userName === userName);

    return userFound;
  }

  findByEmail(email: string): User | undefined {
    const userFound = this.users.find((user) => user.email === email);

    return userFound;
  }

  findByUsernameOrEmail(userName: string, email: string): User | undefined {
    const userFound = this.users.find(
      (user) => user.email === email || user.userName === userName
    );

    return userFound;
  }

  remove(id: number): void {
    for (let index = 0; index < this.users.length; index++) {
      const user = this.users[index];

      if (user.id === id) {
        this.users.slice(index, 1);
      }
    }
  }
}

export default new UserRepository();
