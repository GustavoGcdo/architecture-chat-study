interface IUseCase<T = any, J = any> {
  handle(dto: J): T | Promise<T>;
}

export default IUseCase;
