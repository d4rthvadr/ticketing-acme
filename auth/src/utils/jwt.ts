import jwt from 'jsonwebtoken';
import type { UserDocument } from '../models/user';
import type { UserContextToken } from '../interfaces/user';
import process from 'node:process';

const jwtSecret = process.env.JWT_SECRET! ?? 'JWT_SECRET';

export const signJwtToken = (user: Pick<UserDocument, '_id' | 'email'>) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    jwtSecret,
  );
};

export const getUserContext = (jwtToken: string): null | UserContextToken => {
  try {
    return jwt.verify(jwtToken, jwtSecret) as UserContextToken;
  } catch (e) {
    console.error(e);
    return null;
  }
};
