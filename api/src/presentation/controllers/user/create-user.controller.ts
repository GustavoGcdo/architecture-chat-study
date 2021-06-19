import { HttpRequest, HttpResponse } from '../../../infra/adapters/http';
import { HttpStatus } from '../../../infra/adapters/http-status.enum';
import { BaseController } from '../../../infra/base-controller';
import { HandleResponse } from '../../../infra/handle-response';
import { Result } from '../../../infra/result';
import ReturnUserDto from '../../../modules/user/dtos/returnUserDto';
import CreateUser from '../../../modules/user/usecases/createUser';

class CreateUserController extends BaseController {
  private createUser: CreateUser;

  constructor(createUser: CreateUser) {
    super();
    this.createUser = createUser;
  }

  public async execute(request: HttpRequest): Promise<HttpResponse> {
    try {
      const createdUserResult = await this.createUser.handle(request.body);
      if (createdUserResult.isRight()) {
        const response = new Result<ReturnUserDto>(createdUserResult.value);
        return HandleResponse.created(response);
      }

      const response = new Result<null>(
        null,
        undefined,
        false,
        createdUserResult.value.getErros()
      );

      return {
        body: response,
        status: HttpStatus.BAD_REQUEST
      };
    } catch (error) {
      console.log(error);

      return Promise.resolve(HandleResponse.unexpectedError(error.message));
    }
  }
}

export default CreateUserController;
