import { MessageRoute } from '../../presentation/routes/message';
import { makeGetMessageController } from '../controllers/getMessageController.factory';
import { makeSendMessageController } from '../controllers/sendMessageController.factory';

export function makeMessageRoute(): MessageRoute {
  const getMessageController = makeGetMessageController();
  const sendMessageController = makeSendMessageController();

  return new MessageRoute(sendMessageController, getMessageController);
}
