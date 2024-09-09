import request from 'supertest';
import './helpers/env';
import { UserCredentials } from './helpers/types';
import { setUserAccountSeed } from './helpers/auth';
import { app } from '../app';

const userCredentials: UserCredentials = {
  email: 'user02@example.com',
  password: 'password',
};

it('clears the cookie after signing out', async () => {
  await setUserAccountSeed(userCredentials, app);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')![0]?.includes('session=;')).toBeDefined();
});
