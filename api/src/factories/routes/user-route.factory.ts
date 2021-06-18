import { UserRoute } from '../../presentation/routes/user';
import makeCreateUserController from '../controllers/createUserController.factory';

export default function makeUserRoute(): UserRoute {
  const createUserController = makeCreateUserController();

  return new UserRoute(createUserController);
}
