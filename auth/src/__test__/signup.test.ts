import request from 'supertest';
import { app } from '../app';
import './helpers/env';

it('should return 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
    })
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(201);
});

it('should return 400 with invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user_example.com',
      password: 'password',
    })
    .expect(400);
});

it('should return 400 with invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: '',
    })
    .expect({ message: 'Password is required' })
    .expect(400);
});

it('should set a cookie after a successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user02@example.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
