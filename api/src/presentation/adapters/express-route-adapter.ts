import { Request, Response } from 'express';
import { HttpRequest } from '../../infra/adapters/http';
import { BaseController } from '../../infra/base-controller';

export const adaptRoute = (controller: BaseController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    };
    const httpResponse = await controller.execute(httpRequest);
    res.status(httpResponse.status).send(httpResponse.body);
  };
};
