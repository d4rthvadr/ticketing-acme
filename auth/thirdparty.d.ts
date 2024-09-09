import { UserContextToken } from './interfaces/user';

declare global {
  declare namespace Express {
    interface Request {
      user: UserContextToken;
    }
  }
}
