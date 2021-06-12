import { HttpRequest, HttpResponse } from '../../infra/adapters/http';
import { HttpStatus } from '../../infra/adapters/http-status.enum';
import { BaseController } from '../../infra/base-controller';
import { Result } from '../../infra/result';
import InvalidUserError from '../../modules/auth/errors/invalidUser.error';
import Login from '../../modules/auth/usecases/login';

type controllerReturn = Promise<HttpResponse>;
export class AuthController extends BaseController {
  public execute(request: HttpRequest): controllerReturn {
    try {
      const login = new Login();
      const result = login.handle(request.body);

      if (result.isRight()) {
        const response = new Result<null>(null);
        return Promise.resolve({
          body: response,
          status: HttpStatus.SUCCESS_NO_BODY
        });
      }
      const response = new Result<InvalidUserError>(result.value);
      return Promise.resolve({
        body: response,
        status: HttpStatus.BAD_REQUEST
      });
    } catch ({ message }) {
      const result = new Result<string>(message);
      return Promise.resolve({
        body: result,
        status: HttpStatus.INTERNAL_ERROR
      });
    }
  }
}
