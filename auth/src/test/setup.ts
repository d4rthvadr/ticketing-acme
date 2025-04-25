import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import crypto from 'crypto';
import request from 'supertest';
import { app } from '../app';
import { signJwtToken } from '@vtex-tickets/common';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({});
  const mongoUri = mongoServer.getUri();
  await mongoose
    .connect(mongoUri, {})
    .then(() => {
      console.log('Mongodb connection established');
    })
    .catch((err) => {
      console.log('Failed to connect to mongodb', err);
      process.exit(-1);
    });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.map(async (collection) => await collection.deleteMany({}));
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  await mongoose.connection.close();
});

global.signin = async (email, password) => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  }
  return cookie;
};
