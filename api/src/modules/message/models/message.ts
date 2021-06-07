import { User } from '../../../models/user';

export interface Message {
  text: string;
  user: User;
}
