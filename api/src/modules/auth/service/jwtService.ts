import jwt from 'jsonwebtoken';
import configs from '../../../configs';
import { IJwtService, Payload } from './jwtService.interface';

export class JwtService implements IJwtService {
  generateToken(payload: Payload): string {
    const token = jwt.sign(payload, configs.JWT_SECRET, { expiresIn: '1d' });
    return token;
  }
}
