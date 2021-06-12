import messageRepository from '../../modules/message/repositories/messageRepository';
import MessageDeliveryService from '../../modules/message/services/messageDelivery';
import SendMessage from '../../modules/message/usecases/sendMessage';
import userRepository from '../../modules/_shared/repositories/user.repository';
import { SendMessageController } from '../../presentation/controllers/message/send-message.controller';

export function makeSendMessageController(): SendMessageController {
  const messageDeliveryService = new MessageDeliveryService();
  const sendMessage = new SendMessage(
    messageRepository,
    userRepository,
    messageDeliveryService
  );

  return new SendMessageController(sendMessage);
}
