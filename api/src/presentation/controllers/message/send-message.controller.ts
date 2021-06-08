import { HttpRequest, HttpResponse } from '../../../infra/adapters/http';
import { BaseController } from '../../../infra/base-controller';
import { HandleResponse } from '../../../infra/handle-response';
import { Result } from '../../../infra/result';
import SendMessage from '../../../modules/message/usecases/sendMessage';

export class SendMessageController extends BaseController {
  public execute(request: HttpRequest): Promise<HttpResponse> {
    try {
      const sendMessage = new SendMessage();
      sendMessage.handle(request.body);

      const response = new Result<null>(null);
      return Promise.resolve(HandleResponse.success(response));
    } catch ({ message }) {
      console.log(message);

      return Promise.resolve(HandleResponse.unexpectedError(message));
    }
  }
}