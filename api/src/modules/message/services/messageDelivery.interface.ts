export type MessageToSend = { text: string; user: string };

interface IMessageDeliveryService {
  deliver(message: MessageToSend): void;
}

export default IMessageDeliveryService;
