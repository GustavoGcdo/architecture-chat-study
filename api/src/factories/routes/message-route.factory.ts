import messageRepository from '../../modules/message/repositories/messageRepository';
import GetMessages from '../../modules/message/usecases/getMessages';
import SendMessage from '../../modules/message/usecases/sendMessage';
import { GetMessagesController } from '../../presentation/controllers/message/get-messages.controller';
import { SendMessageController } from '../../presentation/controllers/message/send-message.controller';
import { MessageRoute } from '../../presentation/routes/message';

export function makeMessageRoute(): MessageRoute {
  const getMessages = new GetMessages(messageRepository);
  const sendMessage = new SendMessage(messageRepository);

  const sendMessageController = new SendMessageController(sendMessage);
  const getMessageController = new GetMessagesController(getMessages);

  const route = new MessageRoute(sendMessageController, getMessageController);
  return route;
}
