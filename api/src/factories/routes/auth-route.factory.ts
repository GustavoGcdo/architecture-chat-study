import { AuthController } from '../../presentation/controllers/auth.controller';
import { AuthRoute } from '../../presentation/routes/auth';

export default function makeAuthRoute(): AuthRoute {
  const authController = new AuthController();
  const route = new AuthRoute(authController);

  return route;
}
