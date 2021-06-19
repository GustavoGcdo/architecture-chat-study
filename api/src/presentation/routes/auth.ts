import { Router } from 'express';
import { Route } from '../../infra/route';
import { adaptRoute } from '../adapters/express-route-adapter';
import { AuthController } from '../controllers/auth.controller';

export class AuthRoute implements Route {
  private _controller: AuthController;
  private _router: Router;

  constructor(controller: AuthController) {
    this._controller = controller;
    this._router = Router();
  }

  getRouter(): Router {
    this._router.post('/login', adaptRoute(this._controller));

    return this._router;
  }
}
