import UseCaseError from '../../../infra/usecase.error';

export default class InvalidValuesError extends UseCaseError {
  private errors: string[];

  constructor(errors: string[]) {
    super('Invalid values');
    this.errors = errors;
  }

  public getErros(): string[] {
    return this.errors;
  }
}
