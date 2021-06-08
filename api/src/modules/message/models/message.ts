import { User } from '../../_shared/models/user';

export interface Message {
  text: string;
  user: User;
}
