import { Router } from 'express';
import { Route } from '../../infra/route';
import { adaptRoute } from '../adapters/express-route-adapter';
import { GetMessagesController } from '../controllers/message/get-messages.controller';
import { SendMessageController } from '../controllers/message/send-message.controller';
import authMiddleware from '../middlewares/auth.middleware';

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
    this._router.post(
      '/message',
      authMiddleware.authorize,
      adaptRoute(this._sendMessageController)
    );
    this._router.get(
      '/message',
      authMiddleware.authorize,
      adaptRoute(this._getMessagesController)
    );
    return this._router;
  }
}
