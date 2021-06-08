import { HttpResponse } from './adapters/http';
import { HttpStatus } from './adapters/http-status.enum';
import { Result } from './result';

export abstract class HandleResponse {
  public static create(result: Result<unknown>): HttpResponse {
    return {
      status: HttpStatus.CREATED,
      body: result
    };
  }

  public static success(result: Result<unknown>): HttpResponse {
    return {
      status: HttpStatus.SUCCESS,
      body: result
    };
  }

  public static notFound(error: string): HttpResponse {
    return {
      status: HttpStatus.NOT_FOUND,
      body: new Result(null, '', false, error)
    };
  }

  public static conflict(error: string): HttpResponse {
    return {
      status: HttpStatus.CONFLICT,
      body: new Result(null, '', false, error)
    };
  }

  public static unexpectedError(error: string): HttpResponse {
    return {
      status: HttpStatus.INTERNAL_ERROR,
      body: new Result(null, '', false, error)
    };
  }

  public static serverError(error: Error): HttpResponse {
    return {
      status: HttpStatus.INTERNAL_ERROR,
      body: new Result(null, error.message, false, 'internal server error')
    };
  }
}
