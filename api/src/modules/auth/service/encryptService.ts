import md5 from 'md5';
import IEncryptService from './encryptService.interface';

export class EncryptService implements IEncryptService {
  async compare(value: string, encrypted: string): Promise<boolean> {
    const encryptedValue = md5(value);
    const isMatch = encryptedValue === encrypted;
    return isMatch;
  }

  async encrypt(value: string): Promise<string> {
    const encryptedPassword = md5(value);
    return encryptedPassword;
  }
}
