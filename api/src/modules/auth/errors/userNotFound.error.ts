import UseCaseError from '../../../infra/usecase.error';

export default class InvalidUserError extends UseCaseError {
  constructor() {
    super('User not found');
  }
}
