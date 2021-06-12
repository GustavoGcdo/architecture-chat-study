import UseCaseError from '../../../infra/usecase.error';

export default class InvalidUserNameError extends UseCaseError {
  constructor() {
    super('Invalid user name');
  }
}
