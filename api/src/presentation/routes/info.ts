import { Router } from 'express';
import { Route } from '../../infra/route';
import { InfoController } from '../controllers/info.controller';

export class InfoRoute implements Route {
  private _controller: InfoController;
  private _router: Router;

  constructor(infoController: InfoController) {
    this._controller = infoController;
    this._router = Router();
  }

  getRouter(): Router {
    this._router.get('/', this._controller.getInfoAPI);
    return this._router;
  }
}
