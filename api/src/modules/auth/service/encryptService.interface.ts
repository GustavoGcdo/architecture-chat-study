interface IEncryptService {
  compare(value: string, encrypted: string): Promise<boolean>;
  encrypt(value: string): Promise<string>;
}

export default IEncryptService;
