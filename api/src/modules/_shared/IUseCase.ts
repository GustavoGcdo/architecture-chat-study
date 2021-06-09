interface IUseCase<J = any, T = any> {
  handle(dto: J): T | Promise<T>;
}

export default IUseCase;
