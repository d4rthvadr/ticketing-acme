import { UserContextToken } from './src/interfaces/user';

declare global {
  namespace Express {
    export interface Request {
      user?: UserContextToken;
    }
  }
}

export {};
