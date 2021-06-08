import { Request, Response } from 'express';

export class InfoController {
  async getInfoAPI(request: Request, response: Response) {
    return response.status(200).send({
      name: 'architecture-chat-study-api',
      version: '1.0'
    });
  }
}
