import User from '../models/user';

type findType = User | undefined;

interface IUserRepository {
  create(user: User): User;
  findByUsername(userName: string): findType;
  findByEmail(email: string): findType;
  findByUsernameOrEmail(userName: string, email: string): findType;
  remove(id: number): void;
}

export default IUserRepository;
