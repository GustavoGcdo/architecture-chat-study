import { Router } from 'express';
import { Route } from '../../infra/route';
import { adaptRoute } from '../adapters/express-route-adapter';
import CreateUserController from '../controllers/user/create-user.controller';

export class UserRoute implements Route {
  private _router: Router;
  private createUserController: CreateUserController;

  constructor(createUserController: CreateUserController) {
    this._router = Router();
    this.createUserController = createUserController;
  }

  getRouter(): Router {
    this._router.post('/user', adaptRoute(this.createUserController));
    return this._router;
  }
}
