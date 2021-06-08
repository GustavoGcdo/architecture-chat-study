import { GetMessagesController } from '../../presentation/controllers/message/get-messages.controller';
import { SendMessageController } from '../../presentation/controllers/message/send-message.controller';
import { MessageRoute } from '../../presentation/routes/message';

export function makeMessageRoute(): MessageRoute {
  const sendMessageController = new SendMessageController();
  const getMessageController = new GetMessagesController();

  const route = new MessageRoute(sendMessageController, getMessageController);
  return route;
}
