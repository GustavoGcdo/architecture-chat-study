import { EncryptService } from '../../modules/auth/service/encryptService';
import { JwtService } from '../../modules/auth/service/jwtService';
import Login from '../../modules/auth/usecases/login';
import userRepository from '../../modules/user/repositories/userRepository';
import { AuthController } from '../../presentation/controllers/auth.controller';

export default function makeAuthController(): AuthController {
  const encryptService = new EncryptService();
  const jwtService = new JwtService();
  const loginUseCase = new Login(userRepository, encryptService, jwtService);

  return new AuthController(loginUseCase);
}
