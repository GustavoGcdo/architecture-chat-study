import UseCaseError from '../../../infra/usecase.error';

export default class InvalidUserError extends UseCaseError {
  constructor(message = 'Usuário invalido') {
    super(message);
  }
}
