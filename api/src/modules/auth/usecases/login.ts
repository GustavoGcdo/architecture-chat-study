import { Either, left, right } from '../../../infra/result';
import UserNotFoundError from '../../message/errors/userNotFound.error';
import IUserRepository from '../../user/repositories/userRepository.interface';
import InvalidValuesError from '../../_shared/errors/invalidValues.error';
import IUseCase from '../../_shared/IUseCase';
import UserLoginDto from '../dtos/UserLoginDto';
import InvalidPasswordError from '../errors/invalidPassword.error';
import IEncryptService from '../service/encryptService.interface';
import { IJwtService } from '../service/jwtService.interface';

type ResponseToken = { token: string };
type ResponseHandle = Either<
  InvalidValuesError | UserNotFoundError | InvalidPasswordError,
  ResponseToken
>;

type ResponseLogin = Either<
  UserNotFoundError | InvalidPasswordError,
  ResponseToken
>;
export default class Login
  implements IUseCase<UserLoginDto, Promise<ResponseHandle>>
{
  private userRepository: IUserRepository;
  private encryptService: IEncryptService;
  private jwtService: IJwtService;

  constructor(
    userRepository: IUserRepository,
    encryptService: IEncryptService,
    jwtService: IJwtService
  ) {
    this.userRepository = userRepository;
    this.encryptService = encryptService;
    this.jwtService = jwtService;
  }

  async handle(dto: UserLoginDto): Promise<ResponseHandle> {
    const resultValidation = this.validate(dto);
    if (resultValidation.isLeft()) {
      return left(new InvalidValuesError(resultValidation.value));
    }

    const resultLogin = await this.login(dto);

    if (resultLogin.isRight()) {
      return right(resultLogin.value);
    }

    return left(resultLogin.value);
  }

  private validate(dto: UserLoginDto): Either<string[], void> {
    const { userNameOrEmail, password } = dto;
    const errors: string[] = [];

    if (!userNameOrEmail || userNameOrEmail.trim().length === 0) {
      errors.push('Username or e-mail is required');
    }

    if (!password || password.trim().length === 0) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return left(errors);
    }

    return right(undefined);
  }

  private async login(dto: UserLoginDto): Promise<ResponseLogin> {
    const { password, userNameOrEmail } = dto;
    const userFound = this.userRepository.findByUsernameOrEmail(
      userNameOrEmail,
      userNameOrEmail
    );

    if (!userFound) {
      return left(new UserNotFoundError());
    }

    const validPassword = await this.encryptService.compare(
      password,
      userFound.password
    );

    if (!validPassword) {
      return left(new InvalidPasswordError());
    }

    if (userFound.id) {
      const token = this.jwtService.generateToken({ id: userFound.id });
      return right({ token });
    }

    throw new Error('login: Internal server error');
  }
}
