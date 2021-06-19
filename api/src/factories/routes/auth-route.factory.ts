import { AuthRoute } from '../../presentation/routes/auth';
import makeAuthController from '../controllers/authController.factory';

export default function makeAuthRoute(): AuthRoute {
  const authController = makeAuthController();
  const route = new AuthRoute(authController);

  return route;
}
