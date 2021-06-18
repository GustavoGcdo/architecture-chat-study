import { EncryptService } from '../../modules/auth/service/encryptService';
import userRepository from '../../modules/user/repositories/userRepository';
import CreateUser from '../../modules/user/usecases/createUser';
import { EmailService } from '../../modules/_shared/services/emailService';
import CreateUserController from '../../presentation/controllers/user/create-user.controller';

export default function makeCreateUserController(): CreateUserController {
  const encryptService = new EncryptService();
  const emailService = new EmailService();

  const createUserUseCase = new CreateUser(
    userRepository,
    encryptService,
    emailService
  );

  return new CreateUserController(createUserUseCase);
}
