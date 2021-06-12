import { HttpRequest, HttpResponse } from '../../../infra/adapters/http';
import { HttpStatus } from '../../../infra/adapters/http-status.enum';
import { BaseController } from '../../../infra/base-controller';
import { HandleResponse } from '../../../infra/handle-response';
import { Result } from '../../../infra/result';
import UserNotFoundError from '../../../modules/message/errors/userNotFound.error';
import SendMessage from '../../../modules/message/usecases/sendMessage';

export class SendMessageController extends BaseController {
  private _sendMessage;

  constructor(sendMessage: SendMessage) {
    super();
    this._sendMessage = sendMessage;
  }

  public execute(request: HttpRequest): Promise<HttpResponse> {
    try {
      const sendResult = this._sendMessage.handle(request.body);

      if (sendResult.isRight()) {
        const response = new Result<null>(null);
        return Promise.resolve({
          body: response,
          status: HttpStatus.SUCCESS_NO_BODY
        });
      }

      const error = sendResult.value;

      if (error.constructor === UserNotFoundError) {
        return Promise.resolve({
          body: new Result(error.message),
          status: HttpStatus.NOT_FOUND
        });
      } else {
        return Promise.resolve({
          body: new Result(error.message),
          status: HttpStatus.BAD_REQUEST
        });
      }
    } catch ({ message }) {
      console.log(message);

      return Promise.resolve(HandleResponse.unexpectedError(message));
    }
  }
}
