import { HttpRequest, HttpResponse } from '../../../infra/adapters/http';
import { BaseController } from '../../../infra/base-controller';
import { HandleResponse } from '../../../infra/handle-response';
import { Result } from '../../../infra/result';
import { Message } from '../../../modules/message/models/message';
import GetMessages from '../../../modules/message/usecases/getMessages';

export class GetMessagesController extends BaseController {
  public execute(request: HttpRequest): Promise<HttpResponse> {
    try {
      const getMessages = new GetMessages();
      const messages = getMessages.handle();

      const response = new Result<Message[]>(messages);
      return Promise.resolve(HandleResponse.success(response));
    } catch ({ message }) {
      console.log(message);

      return Promise.resolve(HandleResponse.unexpectedError(message));
    }
  }
}
