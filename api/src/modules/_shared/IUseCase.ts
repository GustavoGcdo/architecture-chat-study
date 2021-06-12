interface IUseCase<J = any, T = any> {
  handle(dto: J): T;
}

export default IUseCase;
