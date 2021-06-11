import messageRepository from '../../modules/message/repositories/messageRepository';
import GetMessages from '../../modules/message/usecases/getMessages';
import { GetMessagesController } from '../../presentation/controllers/message/get-messages.controller';

export function makeGetMessageController(): GetMessagesController {
  const getMessages = new GetMessages(messageRepository);
  return new GetMessagesController(getMessages);
}
