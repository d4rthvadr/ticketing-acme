import { User } from '../../models/user';

export const getUser = (whereQuery: Record<string, unknown>): Promise<any> => {
  return User.findOne(whereQuery);
};
