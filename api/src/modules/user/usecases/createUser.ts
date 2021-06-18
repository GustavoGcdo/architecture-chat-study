import { Either, left, right } from '../../../infra/result';
import IEncryptService from '../../auth/service/encryptService.interface';
import IUseCase from '../../_shared/IUseCase';
import IEmailService from '../../_shared/services/emailService.interface';
import CreateUserDto from '../dtos/createUserDto';
import InvalidValuesError from '../errors/invalidValues.error';
import { UserMapper } from '../mappers/userMapper';
import User from '../models/user';
import IUserRepository from '../repositories/userRepository.interface';

type handleReturn = Either<InvalidValuesError, User>;

class CreateUser implements IUseCase {
  private userRepository: IUserRepository;
  private encryptService: IEncryptService;
  private emailService: IEmailService;

  constructor(
    userRepository: IUserRepository,
    encryptService: IEncryptService,
    emailService: IEmailService
  ) {
    this.userRepository = userRepository;
    this.encryptService = encryptService;
    this.emailService = emailService;
  }

  async handle(dto: CreateUserDto): Promise<handleReturn> {
    const result = this.validate(dto);
    if (result.isLeft()) {
      return left(result.value);
    }

    dto.password = await this.encryptService.encrypt(dto.password);

    const newUser = this.userRepository.create(
      UserMapper.createDtoToModel(dto)
    );
    this.sendValidationEmail(newUser);
    return right(newUser);
  }

  private validate(dto: CreateUserDto): Either<InvalidValuesError, void> {
    const resultAttrs = this.validateRequiredAtributes(dto);
    const resultEmail = this.validateEmail(dto.email);
    const resultUserName = this.validateUserName(dto.userName);
    const resultUserExists = this.validateUserExists(dto.userName, dto.email);
    const resultValidateBirthDate = this.validateBirthDate(dto.birthDate);

    let errors: string[] = [];

    if (resultAttrs.isLeft()) {
      errors = [...errors, ...resultAttrs.value];
    }
    if (resultUserExists.isLeft()) {
      errors = [...errors, ...resultUserExists.value];
    }
    if (resultEmail.isLeft()) {
      errors.push(resultEmail.value);
    }
    if (resultUserName.isLeft()) {
      errors.push(resultUserName.value);
    }
    if (resultValidateBirthDate.isLeft()) {
      errors.push(resultValidateBirthDate.value);
    }
    if (errors.length > 0) {
      return left(new InvalidValuesError(errors));
    }

    return right(undefined);
  }

  private validateRequiredAtributes(
    dto: CreateUserDto
  ): Either<string[], void> {
    const errors: string[] = [];
    if (this.isNullString(dto.email)) {
      errors.push('Email is Required');
    }
    if (this.isNullString(dto.completeName)) {
      errors.push('Name is required');
    }
    if (this.isNullString(dto.userName)) {
      errors.push('Username is required');
    }
    if (this.isNullString(dto.password)) {
      errors.push('Password is required');
    }
    if (!dto.birthDate) {
      errors.push('Birth date is required');
    }

    if (errors.length > 0) {
      return left(errors);
    }

    return right(undefined);
  }

  private validateEmail(email: string): Either<string, void> {
    const re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
      return right(undefined);
    }

    return left('Invalid e-mail');
  }

  private validateUserName(userName: string): Either<string, void> {
    const hasSpace = userName.includes(' ');

    if (hasSpace) {
      return left('Invalid username');
    }

    return right(undefined);
  }

  private validateUserExists(
    userName: string,
    email: string
  ): Either<string[], void> {
    const errors: string[] = [];

    const userNameExists = this.userRepository.findByUsername(userName);
    const userEmailExists = this.userRepository.findByEmail(email);

    if (userNameExists) {
      errors.push('This username is already registered');
    }
    if (userEmailExists) {
      errors.push('This e-mail is already registered');
    }

    if (errors.length > 0) {
      return left(errors);
    }

    return right(undefined);
  }

  private isNullString(value: string | undefined): boolean {
    if (value && value.trim().length > 0) {
      return false;
    }

    return true;
  }

  private async sendValidationEmail(user: User) {
    await this.emailService.send(
      user.email,
      'Confirmação de e-mail',
      'Seu código de confirmação é: 3300 valido por 30 min'
    );
  }

  private validateBirthDate(dateString: string): Either<string, Date> {
    const date = new Date(dateString);
    if (typeof date === 'string') {
      return left(date);
    }
    return right(date);
  }
}

export default CreateUser;
