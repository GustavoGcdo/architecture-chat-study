import { HttpRequest, HttpResponse } from './adapters/http';

export abstract class BaseController {
  public abstract execute(request: HttpRequest): Promise<HttpResponse>;
}
