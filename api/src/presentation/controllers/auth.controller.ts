import { HttpRequest, HttpResponse } from '../../infra/adapters/http';
import { HttpStatus } from '../../infra/adapters/http-status.enum';
import { BaseController } from '../../infra/base-controller';
import { HandleResponse } from '../../infra/handle-response';
import { Result } from '../../infra/result';
import InvalidPasswordError from '../../modules/auth/errors/invalidPassword.error';
import Login from '../../modules/auth/usecases/login';
import UserNotFoundError from '../../modules/message/errors/userNotFound.error';
import InvalidValuesError from '../../modules/_shared/errors/invalidValues.error';

export class AuthController extends BaseController {
  private loginUseCase: Login;

  constructor(loginUserCase: Login) {
    super();
    this.loginUseCase = loginUserCase;
  }

  public async execute(request: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.loginUseCase.handle({
        password: request.body.password,
        userNameOrEmail: request.body.userNameOrEmail
      });

      if (result.isRight()) {
        const response = new Result<{ token: string }>(result.value);
        return {
          body: response,
          status: HttpStatus.SUCCESS
        };
      }

      const error = result.value;

      if (error.constructor === UserNotFoundError) {
        return HandleResponse.notFound(error.message);
      } else if (error.constructor === InvalidPasswordError) {
        return HandleResponse.accessForbidden(error.message);
      } else if (error.constructor === InvalidValuesError) {
        const response = new Result<null>(
          null,
          undefined,
          false,
          error.getErros()
        );
        return {
          body: response,
          status: HttpStatus.BAD_REQUEST
        };
      }

      throw new Error('unexpected error');
    } catch ({ message }) {
      const result = new Result<null>(null, undefined, false, [message]);
      return {
        body: result,
        status: HttpStatus.INTERNAL_ERROR
      };
    }
  }
}
