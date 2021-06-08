import { Router } from 'express';
import { Route } from '../../infra/route';
import { adaptRoute } from '../adapters/express-route-adapter';
import { SendMessageController } from '../controllers/message/send-message.controller';
import { GetMessagesController } from '../controllers/message/get-messages.controller';

export class MessageRoute implements Route {
  private _sendMessageController: SendMessageController;
  private _getMessagesController: GetMessagesController;
  private _router: Router;

  constructor(
    sendMessageController: SendMessageController,
    getMessagesController: GetMessagesController
  ) {
    this._sendMessageController = sendMessageController;
    this._getMessagesController = getMessagesController;
    this._router = Router();
  }

  getRouter(): Router {
    this._router.post('/message', adaptRoute(this._sendMessageController));
    this._router.get('/message', adaptRoute(this._getMessagesController));
    return this._router;
  }
}
