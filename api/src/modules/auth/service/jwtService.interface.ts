export type Payload = { id: number; email?: string; userName?: string };

export interface IJwtService {
  generateToken(payload: Payload): string;
}
