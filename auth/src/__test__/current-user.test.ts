import request from 'supertest';
import './helpers/env';
import { UserCredentials } from './helpers/types';
import { app } from '../app';

const userCredentials: UserCredentials = {
  email: 'user02@example.com',
  password: 'password',
};


it('should respond with details about the current user', async () => {

  const cookie = await global.signin();
  console.log("cookie: ", cookie);

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body?.currentUser?.email).toBe(userCredentials.email);
});

it('should respond null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send({})
    .expect(401);


  expect(response.body?.currentUser?.email).toBeUndefined();
});
