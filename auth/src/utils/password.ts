import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');

    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(hashedOrStored: string, raw: string) {
    const [hashed, salt] = hashedOrStored.split('.');

    if (!hashed || !salt) {
      // throw error

      throw new Error('Invalid hash passed to compare');
    }

    const buf = (await scryptAsync(raw, salt, 64)) as Buffer;

    return buf.toString('hex') === hashed;
  }
}
