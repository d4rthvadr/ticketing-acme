import request from 'supertest';
import { type Express } from 'express';
import { UserCredentials } from './types';

/**
 * Sets up a user account seed by signing up a user with the provided credentials.
 * @param {UserCredentials} credentials - The user credentials (email and password).
 * @param {Express} app - The Express application instance.
 * @returns {Promise<void>} - A promise that resolves when the user account seed is set up successfully.
 */
export const setUserAccountSeed = async (
  { email, password }: UserCredentials,
  app: Express,
) => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
};


export const loginUser = async (
  { email, password }: UserCredentials,
  app: Express,
) => {

  return await request(app)
  .post('/api/users/signin')
  .send({
    email,
    password,
  })
  .expect(200);
}