import UseCaseError from '../../../infra/usecase.error';

export default class UserNotFoundError extends UseCaseError {
  constructor() {
    super('User not found');
  }
}
