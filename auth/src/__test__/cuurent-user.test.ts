import request from 'supertest';
import './helpers/env';
import { UserCredentials } from './helpers/types';
import { setUserAccountSeed } from './helpers/auth';
import { app } from '../app';

const userCredentials: UserCredentials = {
  email: 'user02@example.com',
  password: 'password',
};

it('should respond with details about the current user', async () => {
  const authResponse = await setUserAccountSeed(userCredentials, app);
  const cookie = authResponse.get('Set-Cookie')!;

  console.log(authResponse);
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
    .expect(400);

  expect(response.body?.currentUser?.email).toBeNull();
});
