export interface UserContextToken {
  userId: string;
  email: string;
}

export interface UserAttributes {
  email: string;
  password: string;
  createdAt?: string;
}
