import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import configs from '../../configs';
import { HttpRequest } from '../../infra/adapters/http';
import { HttpStatus } from '../../infra/adapters/http-status.enum';
import { Result } from '../../infra/result';
import User from '../../modules/user/models/user';

export const getPayloadToken = (request: HttpRequest): User => {
  const token =
    request.body.token || request.query.token || request.headers.authorization;
  const replacedToken = token.replace('Bearer ', '');
  const decoded = verify(replacedToken, configs.JWT_SECRET) as User;
  return decoded;
};

class AuthMiddleware {
  public async authorize(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers.authorization;

    if (!token) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .send(
          new Result(null, 'restricted access', false, [
            'this is restricted route'
          ])
        );
    } else {
      try {
        const replacedToken = token.replace('Bearer ', '');
        verify(replacedToken, configs.JWT_SECRET);
        next();
      } catch (error) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .send(
            new Result(null, 'restricted access', false, ['invalid token'])
          );
      }
    }
  }
}

export default new AuthMiddleware();
