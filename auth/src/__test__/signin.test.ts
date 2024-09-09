import request from 'supertest';
import { app } from '../app';
import './helpers/env';
import { UserCredentials } from './helpers/types';
import { setUserAccountSeed } from './helpers/auth';

const userCredentials: UserCredentials = {
  email: 'user02@example.com',
  password: 'password',
};

it('should succeed and respond with a cookie on valid credentials', async () => {
  await setUserAccountSeed(userCredentials, app);
  const { email, password } = userCredentials;
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password,
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should fail when email is not found', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'user@example.com',
      password: 'password',
    })
    .expect(400);
});

it('should fail when password is incorrect', async () => {
  const { email } = userCredentials;
  await setUserAccountSeed(userCredentials, app);
  await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password: 'password01',
    })
    .expect(400);
});

it('should respond with a cookie when password is incorrect', async () => {
  const { email } = userCredentials;
  await setUserAccountSeed(userCredentials, app);
  await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password: 'password01',
    })
    .expect(400);
});
