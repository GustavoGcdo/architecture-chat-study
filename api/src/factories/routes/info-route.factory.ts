import { InfoController } from '../../presentation/controllers/info.controller';
import { InfoRoute } from '../../presentation/routes/info';

export default function makeInfoRoute(): InfoRoute {
  const infoController = new InfoController();
  const route = new InfoRoute(infoController);

  return route;
}
