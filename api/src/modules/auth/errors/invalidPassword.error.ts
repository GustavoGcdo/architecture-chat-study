import UseCaseError from '../../../infra/usecase.error';

export default class InvalidPasswordError extends UseCaseError {
  constructor() {
    super('Invalid password');
  }
}
