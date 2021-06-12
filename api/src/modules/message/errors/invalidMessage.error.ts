import UseCaseError from '../../../infra/usecase.error';

export default class InvalidMessageError extends UseCaseError {
  constructor() {
    super('Invalid message');
  }
}
