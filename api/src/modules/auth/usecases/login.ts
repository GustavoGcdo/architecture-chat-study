import { Either, left, right } from '../../../infra/result';
import IUseCase from '../../_shared/IUseCase';
import userRepository from '../../_shared/repositories/user.repository';
import UserLoginDto from '../dtos/UserLoginDto';
import InvalidUserError from '../errors/invalidUser.error';

type response = Either<InvalidUserError, void>;

export default class Login implements IUseCase<UserLoginDto, response> {
  handle(dto: UserLoginDto): response {
    const { name, socketId } = dto;
    const errors: Error[] = [];

    if (!name || name.trim().length === 0) {
      return left(new InvalidUserError('Invalid user name'));
    }

    if (!socketId || socketId.trim().length === 0) {
      return left(new InvalidUserError('Invalid socket id'));
    }

    userRepository.add({ name, socketId });
    return right(undefined);
  }
}
